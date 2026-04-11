import { prisma } from "@/lib/prisma";
import { AdminCPDashboard } from "@/components/admin-cp/AdminCPDashboard";

export default async function AdminCPPage() {
  const [totalUsers, activeClubs, pendingApprovals, totalPosts, totalEvents, totalGigs, recentSignups, alertCount] = await Promise.all([
    prisma.user.count(),
    prisma.club.count(),
    prisma.user.count({ where: { role: "CLUB_HEADER", approvalStatus: "PENDING" } }),
    prisma.post.count({ where: { hidden: false } }),
    prisma.event.count(),
    prisma.gig.count(),
    prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    prisma.suspiciousAccess.count({ where: { resolved: false } }).catch(() => 0),
  ]);

  const recentAudit = await prisma.auditLog.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, action: true, entity: true, adminEmail: true, createdAt: true },
  }).catch(() => []);

  return (
    <AdminCPDashboard
      stats={{ totalUsers, activeClubs, pendingApprovals, totalPosts, totalEvents, totalGigs, recentSignups, alertCount }}
      recentAudit={recentAudit.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }))}
    />
  );
}
