import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gigApplicationSubmitSchema } from "@/lib/validations";
import { broadcastEClubs, invalidateGigsListCache } from "@/lib/gigs-realtime";
import { isPusherServerConfigured, pusherServer } from "@/lib/pusher";

/**
 * Phase 2: student submits deliverables only after application is APPROVED
 * (club header / admin review).
 */
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = gigApplicationSubmitSchema.parse(body);
  const { gigId } = parsed;

  const gig = await prisma.gig.findUnique({
    where: { id: gigId },
    include: {
      club: { select: { headerId: true, name: true } },
      postedBy: { select: { id: true } },
    },
  });
  if (!gig) return NextResponse.json({ error: "Gig not found" }, { status: 404 });

  const existing = await prisma.gigApplication.findUnique({
    where: { userId_gigId: { userId: user.id, gigId } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Apply to this gig first" }, { status: 400 });
  }
  if (existing.status !== "APPROVED") {
    return NextResponse.json(
      { error: "You can only submit a project after your application is approved" },
      { status: 400 },
    );
  }

  const workDescription = parsed.workDescription.trim();
  const submissionFileUrl = parsed.submissionFileUrl?.trim() || null;
  const submissionFileName = parsed.submissionFileName?.trim() || null;
  const submissionFileMime = parsed.submissionFileMime?.trim() || null;
  const submissionFileSize = parsed.submissionFileSize ?? null;

  const updated = await prisma.gigApplication.update({
    where: { id: existing.id },
    data: {
      workDescription,
      submissionFileUrl,
      submissionFileName: submissionFileUrl ? submissionFileName : null,
      submissionFileMime: submissionFileUrl ? submissionFileMime : null,
      submissionFileSize: submissionFileUrl ? submissionFileSize : null,
    },
  });

  invalidateGigsListCache();
  await broadcastEClubs({
    type: "gig-submission",
    gigId,
    applicationId: updated.id,
    userId: user.id,
  });

  const headerId = gig.postedById ?? gig.club?.headerId ?? null;
  if (headerId && headerId !== user.id) {
    try {
      await prisma.notification.create({
        data: {
          userId: headerId,
          type: "gig_submission",
          title: "Gig deliverables submitted",
          message: `${user.fullName} submitted work for “${gig.title}”.`,
          data: { gigId, applicationId: updated.id, applicantId: user.id },
        },
      });
      if (isPusherServerConfigured()) {
        await pusherServer.trigger(`user-${headerId}`, "notification", {
          title: "Gig submission",
          message: `${user.fullName} submitted deliverables for “${gig.title}”.`,
        });
      }
    } catch (e) {
      console.warn("[gig-applications/submit] notify header failed:", e);
    }
  }

  return NextResponse.json({ success: true, applicationId: updated.id });
}
