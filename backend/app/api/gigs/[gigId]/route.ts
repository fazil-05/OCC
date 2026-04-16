import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gigUpdateSchema } from "@/lib/validations";
import { broadcastEClubs, invalidateGigsListCache } from "@/lib/gigs-realtime";

async function getOwnedGig(gigId: string, userId: string, clubId: string) {
  return prisma.gig.findFirst({
    where: {
      id: gigId,
      OR: [{ clubId }, { postedById: userId }],
    },
  });
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ gigId: string }> },
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "CLUB_HEADER" || user.approvalStatus !== "APPROVED" || !user.clubManaged) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { gigId } = await ctx.params;
  const existing = await getOwnedGig(gigId, user.id, user.clubManaged.id);
  if (!existing) {
    return NextResponse.json({ error: "Gig not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = gigUpdateSchema.parse(body);
  const deadline =
    parsed.deadline && parsed.deadline.trim() !== ""
      ? new Date(parsed.deadline)
      : null;

  if (parsed.payMax < parsed.payMin) {
    return NextResponse.json({ error: "Maximum pay must be ≥ minimum pay" }, { status: 400 });
  }

  const gig = await prisma.gig.update({
    where: { id: gigId },
    data: {
      title: parsed.title,
      description: parsed.description,
      payMin: parsed.payMin,
      payMax: parsed.payMax,
      deadline,
    },
  });

  invalidateGigsListCache();
  await broadcastEClubs({ type: "gig-updated", gigId: gig.id });

  return NextResponse.json({ success: true, gig });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ gigId: string }> },
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "CLUB_HEADER" || user.approvalStatus !== "APPROVED" || !user.clubManaged) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { gigId } = await ctx.params;
  const existing = await getOwnedGig(gigId, user.id, user.clubManaged.id);
  if (!existing) {
    return NextResponse.json({ error: "Gig not found" }, { status: 404 });
  }

  await prisma.gig.delete({ where: { id: gigId } });

  invalidateGigsListCache();
  await broadcastEClubs({ type: "gig-deleted", gigId });

  return NextResponse.json({ success: true });
}
