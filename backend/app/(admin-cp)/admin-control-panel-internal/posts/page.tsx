import { prisma } from "@/lib/prisma";
import { PostsCRUD } from "@/components/admin-cp/PostsCRUD";

export default async function AdminCPPostsPage() {
  const [posts, clubs] = await Promise.all([
    prisma.post.findMany({
      select: {
        id: true, caption: true, content: true, imageUrl: true, hidden: true, pinned: true,
        likesCount: true, createdAt: true,
        club: { select: { id: true, name: true } },
        user: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.club.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <PostsCRUD
      posts={posts.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() }))}
      clubs={clubs}
    />
  );
}
