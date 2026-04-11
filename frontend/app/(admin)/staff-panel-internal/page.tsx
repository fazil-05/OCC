import { prisma } from "@/lib/prisma";
import { AdminOverviewClient } from "@/components/admin/AdminOverviewClient";

export default async function AdminPage() {
  const [totalUsers, activeClubs, pendingApprovals, totalPosts] = await Promise.all([
    prisma.user.count(),
    prisma.club.count(),
    prisma.user.count({ where: { role: "CLUB_HEADER", approvalStatus: "PENDING" } }),
    prisma.post.count({ where: { hidden: false } }),
  ]);

  return (
    <AdminOverviewClient 
      totalUsers={totalUsers}
      activeClubs={activeClubs}
      pendingApprovals={pendingApprovals}
      totalPosts={totalPosts}
    />
  );
}
