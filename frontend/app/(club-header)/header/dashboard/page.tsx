import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { HeaderOverviewClient } from "@/components/club-header/HeaderOverviewClient";
import { ensureReferralStatsForClubHeader } from "@/lib/sync-referral-stats";

export default async function HeaderDashboardPage() {
  const user = await requireUser();
  await ensureReferralStatsForClubHeader(user.id);

  const [membersCount, postsCount] = await Promise.all([
    prisma.referralStat.count({ where: { clubHeaderId: user.id } }),
    prisma.post.count({ where: { userId: user.id } }),
  ]);

  return (
    <HeaderOverviewClient
      headerId={user.id}
      membersCount={membersCount}
      postsCount={postsCount}
      clubName={user.clubManaged?.name ?? "Your Club"}
      referralCode={user.referralCode ?? "PENDING"}
      hasClub={!!user.clubManaged}
    />
  );
}
