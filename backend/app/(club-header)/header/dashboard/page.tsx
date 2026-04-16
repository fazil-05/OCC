import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { HeaderOverviewClient } from "@/components/club-header/HeaderOverviewClient";
import { ensureReferralStatsForClubHeader } from "@/lib/sync-referral-stats";
import { getRecentClubSocialActivity } from "@/lib/recent-social-activity";

export default async function HeaderDashboardPage() {
  const user = await requireUser();
  await ensureReferralStatsForClubHeader(user.id);

  const clubId = user.clubManaged?.id ?? null;

  const [membersCount, postsCount, recentSocialRaw] = await Promise.all([
    prisma.referralStat.count({ where: { clubHeaderId: user.id } }),
    prisma.post.count({ where: { userId: user.id } }),
    clubId ? getRecentClubSocialActivity(clubId, 14).catch(() => []) : Promise.resolve([]),
  ]);

  return (
    <HeaderOverviewClient
      headerId={user.id}
      clubId={clubId}
      membersCount={membersCount}
      postsCount={postsCount}
      clubName={user.clubManaged?.name ?? "Your Club"}
      referralCode={user.referralCode ?? "PENDING"}
      hasClub={!!user.clubManaged}
      recentSocialActivity={recentSocialRaw.map((r) => ({
        id: r.id,
        kind: r.kind,
        actorName: r.actorName,
        summary: r.summary,
        postId: r.postId,
        createdAt: r.createdAt.toISOString(),
      }))}
    />
  );
}
