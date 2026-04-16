import { prisma } from "@/lib/prisma";
import { AdminCPDashboard } from "@/components/admin-cp/AdminCPDashboard";
import { getRecentGlobalSocialActivity } from "@/lib/recent-social-activity";

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

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [recentAudit, recentSocialRaw, recentActivity] = await Promise.all([
    prisma.auditLog
      .findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, action: true, entity: true, adminEmail: true, createdAt: true },
      })
      .catch(() => []),
    getRecentGlobalSocialActivity(14).catch(() => []),
    prisma.activityEvent
      .findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        take: 20,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          actorName: true,
          actorRole: true,
          category: true,
          eventType: true,
          summary: true,
          entityType: true,
          entityId: true,
          createdAt: true,
        },
      })
      .catch(() => []),
  ]);

  return (
    <AdminCPDashboard
      stats={{ totalUsers, activeClubs, pendingApprovals, totalPosts, totalEvents, totalGigs, recentSignups, alertCount }}
      recentAudit={recentAudit.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }))}
      recentSocial={recentSocialRaw.map((r) => ({
        id: r.id,
        kind: r.kind,
        actorName: r.actorName,
        summary: r.summary,
        postId: r.postId,
        createdAt: r.createdAt.toISOString(),
      }))}
      recentActivity={recentActivity.map((r) => ({
        ...r,
        actorRole: r.actorRole ?? null,
        entityType: r.entityType ?? null,
        entityId: r.entityId ?? null,
        createdAt: r.createdAt.toISOString(),
      }))}
    />
  );
}
