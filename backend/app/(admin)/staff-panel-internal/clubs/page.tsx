import { prisma } from "@/lib/prisma";
import { ClubsAdminClient, type ClubRow } from "@/components/admin/ClubsAdminClient";

export default async function AdminClubsPage() {
  const clubs = await prisma.club.findMany({
    include: { header: { select: { id: true, fullName: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const rows: ClubRow[] = clubs.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    theme: c.theme,
    memberCount: c.memberCount,
    postingFrozen: c.postingFrozen,
    header: c.header,
  }));

  return <ClubsAdminClient clubs={rows} />;
}
