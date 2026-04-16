import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "CLUB_HEADER" || user.approvalStatus !== "APPROVED") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const members = await prisma.referralStat.findMany({
    where: { clubHeaderId: user.id },
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
          collegeName: true,
          email: true,
          createdAt: true,
          avatar: true,
        },
      },
    },
    orderBy: { registeredAt: "desc" },
  });

  return NextResponse.json({ members });
}
