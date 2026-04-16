import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ACTIVITY_CATEGORIES, logActivityEvent } from "@/lib/activity-events";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    select: { id: true, hidden: true },
  });
  if (!post || post.hidden) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const existing = await prisma.postBookmark.findUnique({
    where: { postId_userId: { postId: params.id, userId: user.id } },
  });

  if (existing) {
    await prisma.postBookmark.delete({ where: { id: existing.id } });
    await logActivityEvent({
      actor: { userId: user.id, name: user.fullName, role: user.role },
      category: ACTIVITY_CATEGORIES.social,
      eventType: "post_bookmark_removed",
      summary: `${user.fullName} removed a bookmark`,
      entityType: "post",
      entityId: params.id,
      broadcast: true,
    });
    return NextResponse.json({ success: true, bookmarked: false });
  }

  await prisma.postBookmark.create({
    data: { postId: params.id, userId: user.id },
  });
  await logActivityEvent({
    actor: { userId: user.id, name: user.fullName, role: user.role },
    category: ACTIVITY_CATEGORIES.social,
    eventType: "post_bookmark_added",
    summary: `${user.fullName} bookmarked a post`,
    entityType: "post",
    entityId: params.id,
    broadcast: true,
  });
  return NextResponse.json({ success: true, bookmarked: true });
}
