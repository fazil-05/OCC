import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Club header: own posts for managed club. Admin: optional clubId filter or all. */
export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clubIdParam = new URL(req.url).searchParams.get("clubId");

  if (user.role === "ADMIN") {
    const posts = await prisma.post.findMany({
      where: clubIdParam ? { clubId: clubIdParam } : {},
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        caption: true,
        content: true,
        imageUrl: true,
        type: true,
        createdAt: true,
        clubId: true,
        userId: true,
        club: { select: { name: true, slug: true } },
      },
    });
    return NextResponse.json({ posts });
  }

  if (user.role !== "CLUB_HEADER" || user.approvalStatus !== "APPROVED" || !user.clubManaged) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const posts = await prisma.post.findMany({
    where: {
      userId: user.id,
      clubId: user.clubManaged.id,
    },
    orderBy: { createdAt: "desc" },
    take: 80,
    select: {
      id: true,
      caption: true,
      content: true,
      imageUrl: true,
      type: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ posts });
}
