import { prisma } from "@/lib/prisma";

export type SocialActivityRow = {
  id: string;
  kind: "like" | "comment";
  actorName: string;
  summary: string;
  postId: string;
  createdAt: Date;
};

function snippet(caption: string | null, content: string | null): string {
  const t = (caption || content || "Post").trim();
  return t.length > 56 ? `${t.slice(0, 53)}…` : t;
}

function mergeSocialRows(
  likes: {
    id: string;
    createdAt: Date;
    user: { fullName: string };
    post: { id: string; caption: string | null; content: string | null; club: { name: string } | null };
  }[],
  comments: {
    id: string;
    createdAt: Date;
    content: string;
    user: { fullName: string };
    post: { id: string; caption: string | null; content: string | null; club: { name: string } | null };
  }[],
  take: number,
): SocialActivityRow[] {
  const likeRows: SocialActivityRow[] = likes.map((l) => ({
    id: `like-${l.id}`,
    kind: "like",
    actorName: l.user.fullName,
    summary: `liked “${snippet(l.post.caption, l.post.content)}”${l.post.club?.name ? ` · ${l.post.club.name}` : ""}`,
    postId: l.post.id,
    createdAt: l.createdAt,
  }));
  const commentRows: SocialActivityRow[] = comments.map((c) => {
    const prev =
      c.content.trim().length > 64 ? `${c.content.trim().slice(0, 61)}…` : c.content.trim();
    return {
      id: `comment-${c.id}`,
      kind: "comment",
      actorName: c.user.fullName,
      summary: `commented on “${snippet(c.post.caption, c.post.content)}”: “${prev}”`,
      postId: c.post.id,
      createdAt: c.createdAt,
    };
  });
  return [...likeRows, ...commentRows]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, take);
}

export async function getRecentGlobalSocialActivity(take = 14): Promise<SocialActivityRow[]> {
  const n = Math.max(4, Math.ceil(take / 2) + 2);
  const [likes, comments] = await Promise.all([
    prisma.postLike.findMany({
      orderBy: { createdAt: "desc" },
      take: n,
      include: {
        user: { select: { fullName: true } },
        post: {
          select: {
            id: true,
            caption: true,
            content: true,
            club: { select: { name: true } },
          },
        },
      },
    }),
    prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: n,
      include: {
        user: { select: { fullName: true } },
        post: {
          select: {
            id: true,
            caption: true,
            content: true,
            club: { select: { name: true } },
          },
        },
      },
    }),
  ]);
  return mergeSocialRows(likes, comments, take);
}

export async function getRecentClubSocialActivity(clubId: string, take = 14): Promise<SocialActivityRow[]> {
  const n = Math.max(4, Math.ceil(take / 2) + 2);
  const [likes, comments] = await Promise.all([
    prisma.postLike.findMany({
      where: { post: { clubId } },
      orderBy: { createdAt: "desc" },
      take: n,
      include: {
        user: { select: { fullName: true } },
        post: {
          select: {
            id: true,
            caption: true,
            content: true,
            club: { select: { name: true } },
          },
        },
      },
    }),
    prisma.comment.findMany({
      where: { post: { clubId } },
      orderBy: { createdAt: "desc" },
      take: n,
      include: {
        user: { select: { fullName: true } },
        post: {
          select: {
            id: true,
            caption: true,
            content: true,
            club: { select: { name: true } },
          },
        },
      },
    }),
  ]);
  return mergeSocialRows(likes, comments, take);
}
