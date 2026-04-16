import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyAllAdmins } from "@/lib/notify-admins";
import { isPusherServerConfigured, pusherServer } from "@/lib/pusher";
import { ACTIVITY_CATEGORIES, extractRequestIp, logActivityEvent } from "@/lib/activity-events";

const VERIFY_ACTION = "VERIFY_GIG_SUBMISSION";

/** Club Header/Admin review mark for student project submission. */
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdmin = user.role === "ADMIN";
  const isHeader = user.role === "CLUB_HEADER" && user.approvalStatus === "APPROVED";
  if (!isAdmin && !isHeader) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
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

  if (isHeader) {
    const ownsGig =
      application.gig.postedById === user.id ||
      (!!user.clubManaged?.id && application.gig.clubId === user.clubManaged.id);
    if (!ownsGig) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const hasSubmission =
    !!application.workDescription?.trim() || !!application.submissionFileUrl?.trim();
  if (!hasSubmission) {
    return NextResponse.json(
      { error: "No submission found for this application yet" },
      { status: 400 },
    );
  }

  const existing = await prisma.auditLog.findFirst({
    where: {
      action: VERIFY_ACTION,
      entity: "gig_application",
      entityId: application.id,
    },
    orderBy: { createdAt: "desc" },
  });
  if (existing) {
    return NextResponse.json({ success: true, alreadyVerified: true });
  }

  await prisma.auditLog.create({
    data: {
      adminId: user.id,
      adminEmail: user.email,
      action: VERIFY_ACTION,
      entity: "gig_application",
      entityId: application.id,
      details: {
        gigId: application.gigId,
        applicantId: application.userId,
        byRole: user.role,
      },
    },
  });

  try {
    await prisma.notification.create({
      data: {
        userId: application.userId,
        type: "gig_submission_verified",
        title: "Gig submission verified",
        message: `Your project submission for “${application.gig.title}” was reviewed and verified.`,
        data: { gigId: application.gig.id, applicationId: application.id },
      },
    });
    if (isPusherServerConfigured()) {
      await pusherServer.trigger(`user-${application.userId}`, "notification", {
        title: "Submission verified",
        message: `“${application.gig.title}” submission verified.`,
      });
    }
  } catch (e) {
    console.warn("[gig-applications/verify] applicant notify failed:", e);
  }

  try {
    await notifyAllAdmins(
      "gig_submission_verified",
      "Gig submission verified",
      `${user.fullName} verified ${application.user.fullName}'s submission for “${application.gig.title}”.`,
      { gigId: application.gigId, applicationId: application.id },
    );
  } catch (e) {
    console.warn("[gig-applications/verify] admin notify failed:", e);
  }
  await logActivityEvent({
    actor: { userId: user.id, name: user.fullName, role: user.role },
    category: ACTIVITY_CATEGORIES.moderation,
    eventType: "gig_submission_verified",
    summary: `${user.fullName} verified a gig submission`,
    entityType: "gig_application",
    entityId: application.id,
    metadata: { gigId: application.gigId, applicantId: application.userId },
    ipAddress: extractRequestIp(req),
    broadcast: true,
  });

  return NextResponse.json({ success: true, verified: true });
}
