import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gigCreateSchema } from "@/lib/validations";
import { broadcastEClubs, invalidateGigsListCache } from "@/lib/gigs-realtime";
import { notifyAllAdmins } from "@/lib/notify-admins";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const club = user.clubManaged;
  if (user.role !== "CLUB_HEADER" || user.approvalStatus !== "APPROVED" || !club) {
    return NextResponse.json({ error: "Only approved club headers with a club can post gigs" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = gigCreateSchema.parse(body);
  const deadline =
    parsed.deadline && parsed.deadline.trim() !== ""
      ? new Date(parsed.deadline)
      : null;

  if (parsed.payMax < parsed.payMin) {
    return NextResponse.json({ error: "Maximum pay must be ≥ minimum pay" }, { status: 400 });
  }

  const gig = await prisma.gig.create({
    data: {
      title: parsed.title,
      description: parsed.description,
      payMin: parsed.payMin,
      payMax: parsed.payMax,
      clubId: club.id,
      postedById: user.id,
      deadline,
    },
  });

  invalidateGigsListCache();
  await broadcastEClubs({ type: "gig-created", gigId: gig.id });

  try {
    await notifyAllAdmins(
      "gig_created",
      "New gig posted",
      `${user.fullName} posted “${gig.title}” (${club.name}).`,
      { gigId: gig.id, clubId: club.id },
    );
  } catch (e) {
    console.warn("[gigs/create] admin notify failed:", e);
  }

  return NextResponse.json({ success: true, gig });
}
