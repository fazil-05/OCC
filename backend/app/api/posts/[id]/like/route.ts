import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { displayPostLikes } from "@/lib/socialDisplay";
import { notifyPostLiked } from "@/lib/post-engagement-notify";
import { ACTIVITY_CATEGORIES, logActivityEvent } from "@/lib/activity-events";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const postRow = await prisma.post.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      hidden: true,
      likesCount: true,
      caption: true,
      content: true,
      clubId: true,
      club: { select: { headerId: true } },
    },
  });
  if (!postRow || postRow.hidden) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const existing = await prisma.postLike.findUnique({
    where: { postId_userId: { postId: params.id, userId: user.id } },
  });

  const addedLike = !existing;

  const updatedPost = await prisma.$transaction(async (tx) => {
    if (existing) {
      await tx.postLike.delete({ where: { id: existing.id } });
      return tx.post.update({
        where: { id: params.id },
        data: {
          likesCount: Math.max(0, (postRow.likesCount ?? 0) - 1),
          likes: Math.max(0, (postRow.likesCount ?? 0) - 1),
        },
        select: { likesCount: true },
      });
    }
    await tx.postLike.create({ data: { postId: params.id, userId: user.id } });
    return tx.post.update({
      where: { id: params.id },
      data: {
        likesCount: (postRow.likesCount ?? 0) + 1,
        likes: (postRow.likesCount ?? 0) + 1,
      },
      select: { likesCount: true },
    });
  });

  const likesCount = displayPostLikes(params.id, updatedPost.likesCount ?? 0);
  const action = addedLike ? "like" : "unlike";
  await logActivityEvent({
    actor: { userId: user.id, name: user.fullName, role: user.role },
    category: ACTIVITY_CATEGORIES.social,
    eventType: addedLike ? "post_like_added" : "post_like_removed",
    summary: `${user.fullName} ${addedLike ? "liked" : "unliked"} a post`,
    entityType: "post",
    entityId: params.id,
    metadata: { clubId: postRow.clubId },
    broadcast: true,
  });

  try {
    await pusherServer.trigger(`club-${postRow.clubId}`, "new-like", {
      postId: params.id,
      likesCount,
      actorUserId: user.id,
      actorName: user.fullName,
      action,
    });
  } catch (e) {
    console.warn("[posts/like] Pusher failed (non-critical):", e);
  }

  if (addedLike) {
    void notifyPostLiked({
      postId: params.id,
      clubId: postRow.clubId,
      headerId: postRow.club?.headerId ?? null,
      likerId: user.id,
      likerName: user.fullName,
      caption: postRow.caption,
      content: postRow.content,
    });
  }

  return NextResponse.json({ success: true, likesCount, liked: addedLike });
}
