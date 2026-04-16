import { prisma } from "@/lib/prisma";

/**
 * Creates missing `referral_stats` rows for students who already have `referredBy` set
 * (e.g. older onboarding runs or partial failures) so club headers see them in /header/members.
 */
export async function ensureReferralStatsForClubHeader(headerId: string): Promise<void> {
  let club = await prisma.club.findFirst({ where: { headerId } });
  if (!club) {
    const u = await prisma.user.findUnique({
      where: { id: headerId },
      select: { clubManagedId: true, pendingLeadClubId: true },
    });
    if (u?.clubManagedId) {
      club = await prisma.club.findUnique({ where: { id: u.clubManagedId } });
    } else if (u?.pendingLeadClubId) {
      club = await prisma.club.findUnique({ where: { id: u.pendingLeadClubId } });
    }
  }
  if (!club) return;

  const referredStudents = await prisma.user.findMany({
    where: { referredBy: headerId },
    select: { id: true },
  });
  if (referredStudents.length === 0) return;

  const existing = await prisma.referralStat.findMany({
    where: { clubHeaderId: headerId },
    select: { studentId: true },
  });
  const have = new Set(existing.map((e) => e.studentId));

  for (const { id: studentId } of referredStudents) {
    if (have.has(studentId)) continue;
    try {
      await prisma.referralStat.create({
        data: {
          clubHeaderId: headerId,
          studentId,
          clubId: club.id,
        },
      });
      have.add(studentId);
    } catch (e) {
      console.warn("[sync-referral-stats] skip row:", studentId, e);
    }
  }
}
