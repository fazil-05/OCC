import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { resolveClubHeaderByReferralCode } from "@/lib/referral-resolve";

/**
 * Links a student to a club header by referral code (membership + referral_stats + notification + Pusher).
 */
export async function attachStudentToReferralCode(params: {
  studentId: string;
  studentFullName: string;
  studentCollegeName: string;
  codeRaw: string;
}): Promise<{ ok: true } | { ok: false }> {
  const resolved = await resolveClubHeaderByReferralCode(params.codeRaw);
  if (!resolved) {
    return { ok: false };
  }

  const { header: headerUser, club: managedClub } = resolved;

  try {
    await prisma.user.update({
      where: { id: params.studentId },
      data: { referredBy: headerUser.id },
    });

    await prisma.clubMembership.upsert({
      where: {
        userId_clubId: { userId: params.studentId, clubId: managedClub.id },
      },
      update: {},
      create: { userId: params.studentId, clubId: managedClub.id },
    });

    const existingStat = await prisma.referralStat.findFirst({
      where: {
        clubHeaderId: headerUser.id,
        studentId: params.studentId,
      },
    });

    if (!existingStat) {
      await prisma.referralStat.create({
        data: {
          clubHeaderId: headerUser.id,
          studentId: params.studentId,
          clubId: managedClub.id,
        },
      });

      await prisma.notification.create({
        data: {
          userId: headerUser.id,
          type: "new-referral",
          title: "New student joined",
          message: `${params.studentFullName} joined using your referral code.`,
          data: { studentId: params.studentId },
        },
      });

      await pusherServer.trigger(`header-${headerUser.id}`, "new-member", {
        member: {
          id: params.studentId,
          fullName: params.studentFullName,
          collegeName: params.studentCollegeName,
          registeredAt: new Date().toISOString(),
        },
      });
    }
  } catch (e) {
    console.warn("[attach-referral] failed:", e);
    return { ok: false };
  }

  return { ok: true };
}
