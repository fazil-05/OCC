import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Club header: list applications for a gig owned by their club. */
export async function GET(
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

  const club = user.clubManaged;
  const { gigId } = await ctx.params;

  const gig = await prisma.gig.findUnique({
    where: { id: gigId },
    select: { id: true, clubId: true, postedById: true, title: true },
  });
  if (!gig) {
    return NextResponse.json({ error: "Gig not found" }, { status: 404 });
  }

  const owns =
    gig.clubId === club.id ||
    gig.postedById === user.id;
  if (!owns) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const applications = await prisma.gigApplication.findMany({
    where: { gigId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          avatar: true,
          collegeName: true,
        },
      },
    },
  });

  return NextResponse.json({ gig, applications });
}
