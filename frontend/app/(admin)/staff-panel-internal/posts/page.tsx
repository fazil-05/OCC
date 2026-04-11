import { prisma } from "@/lib/prisma";
import { AdminPostsClient, type AdminPostRow } from "@/components/admin/AdminPostsClient";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    include: {
      user: { select: { fullName: true, email: true } },
      club: { select: { name: true, slug: true } },
      _count: { select: { comments: true, postLikes: true } },
    },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    take: 80,
  });

  const rows: AdminPostRow[] = posts.map((p) => ({
    id: p.id,
    content: p.content,
    caption: p.caption,
    imageUrl: p.imageUrl,
    type: p.type,
    hidden: p.hidden,
    pinned: p.pinned,
    createdAt: p.createdAt.toISOString(),
    user: p.user,
    club: p.club,
    _count: p._count,
  }));

  return <AdminPostsClient posts={rows} />;
}
