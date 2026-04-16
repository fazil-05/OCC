import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { displayPostLikes } from "@/lib/socialDisplay";

/** Current user's like/bookmark state + public display like count (seed + real). */
export async function GET(_: Request, { params }: { params: { id: string } }) {
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

  const [realLikes, liked, bookmarked] = await Promise.all([
    prisma.postLike.count({ where: { postId: params.id } }),
    prisma.postLike.findUnique({
      where: { postId_userId: { postId: params.id, userId: user.id } },
      select: { id: true },
    }),
    prisma.postBookmark.findUnique({
      where: { postId_userId: { postId: params.id, userId: user.id } },
      select: { id: true },
    }),
  ]);

  return NextResponse.json({
    liked: !!liked,
    bookmarked: !!bookmarked,
    likesCount: displayPostLikes(params.id, realLikes),
  });
}
