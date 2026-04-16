import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gigApplicationReviewSchema } from "@/lib/validations";
import { broadcastEClubs, invalidateGigsListCache } from "@/lib/gigs-realtime";
import { notifyAllAdmins } from "@/lib/notify-admins";
import { isPusherServerConfigured, pusherServer } from "@/lib/pusher";
import { ACTIVITY_CATEGORIES, extractRequestIp, logActivityEvent } from "@/lib/activity-events";

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const isApprovedHeader = user.role === "CLUB_HEADER" && user.approvalStatus === "APPROVED";
  const isAdmin = user.role === "ADMIN";
  if (!isApprovedHeader && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = await req.json();
  const { status: nextStatus } = gigApplicationReviewSchema.parse(body);

  const application = await prisma.gigApplication.findUnique({
    where: { id },
    include: {
      gig: { select: { id: true, title: true, clubId: true, postedById: true } },
      user: { select: { id: true, fullName: true } },
    },
  });

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const gig = application.gig;
  const owns =
    isAdmin ||
    gig.postedById === user.id ||
    (!!user.clubManaged?.id && gig.clubId === user.clubManaged.id);
  if (!owns) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (application.status === "APPROVED" || application.status === "REJECTED") {
    return NextResponse.json(
      { error: "Application already resolved" },
      { status: 400 },
    );
  }

  const updated = await prisma.gigApplication.update({
    where: { id },
    data: { status: nextStatus },
  });

  invalidateGigsListCache();
  await broadcastEClubs({
    type: "gig-application-status",
    gigId: gig.id,
    applicationId: id,
    status: nextStatus,
    userId: application.userId,
  });

  const verb = nextStatus === "APPROVED" ? "approved" : "declined";
  try {
    await prisma.notification.create({
      data: {
        userId: application.userId,
        type: "gig_application_" + nextStatus.toLowerCase(),
        title: nextStatus === "APPROVED" ? "Gig application approved" : "Gig application update",
        message: `Your application for “${gig.title}” was ${verb}.`,
        data: { gigId: gig.id, applicationId: id },
      },
    });
    if (isPusherServerConfigured()) {
      await pusherServer.trigger(`user-${application.userId}`, "notification", {
        title: nextStatus === "APPROVED" ? "Gig approved" : "Gig application",
        message: `“${gig.title}” — ${verb}.`,
      });
    }
  } catch (e) {
    console.warn("[gig-applications/patch] notify applicant failed:", e);
  }

  try {
    await notifyAllAdmins(
      "gig_application_review",
      `Gig application ${verb}`,
      `${user.fullName} ${verb} ${application.user.fullName} for “${gig.title}”.`,
      { gigId: gig.id, applicationId: id, status: nextStatus },
    );
  } catch (e) {
    console.warn("[gig-applications/patch] admin notify failed:", e);
  }
  await logActivityEvent({
    actor: { userId: user.id, name: user.fullName, role: user.role },
    category: ACTIVITY_CATEGORIES.moderation,
    eventType: nextStatus === "APPROVED" ? "gig_application_approved" : "gig_application_rejected",
    summary: `${user.fullName} ${verb} a gig application`,
    entityType: "gig_application",
    entityId: id,
    metadata: { gigId: gig.id, applicantId: application.userId, status: nextStatus },
    ipAddress: extractRequestIp(req),
    broadcast: true,
  });

  return NextResponse.json({ success: true, application: updated });
}
