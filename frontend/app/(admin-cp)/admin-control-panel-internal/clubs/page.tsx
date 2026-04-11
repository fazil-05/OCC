import { prisma } from "@/lib/prisma";
import { ClubsCRUD } from "@/components/admin-cp/ClubsCRUD";

export default async function AdminCPClubsPage() {
  const [clubs, headers] = await Promise.all([
    prisma.club.findMany({
      include: {
        header: { select: { id: true, fullName: true, email: true } },
        _count: { select: { members: true, posts: true, events: true, gigs: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { role: "CLUB_HEADER", approvalStatus: "APPROVED" },
      select: { id: true, fullName: true, email: true },
    }),
  ]);

  return (
    <ClubsCRUD
      clubs={clubs.map((c) => ({
        id: c.id, name: c.name, slug: c.slug, icon: c.icon, description: c.description,
        theme: c.theme, coverImage: c.coverImage, postingFrozen: c.postingFrozen,
        memberCount: c.memberCount, createdAt: c.createdAt.toISOString(),
        header: c.header, _count: c._count,
      }))}
      headers={headers}
    />
  );
}
