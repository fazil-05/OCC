import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET() {
  const user = await requireUser();
  
  if (user.role !== "CLUB_HEADER" && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clubId = user.clubManagedId;
  if (!clubId && user.role !== "ADMIN") {
     return NextResponse.json({ events: [] });
  }

  const events = await prisma.event.findMany({
    where: clubId ? { clubId } : {},
    include: {
      _count: { select: { registrations: true } }
    },
    orderBy: { date: "desc" }
  });

  return NextResponse.json({
    events: events.map(e => ({
      ...e,
      date: e.date.toISOString(),
      createdAt: e.createdAt.toISOString()
    }))
  });
}
