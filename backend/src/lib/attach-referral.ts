import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { resolveClubHeaderByReferralCode } from "@/lib/referral-resolve";
import { displayClubMembers } from "@/lib/socialDisplay";
import { resolveClubAvatar } from "@/lib/postImageUrl";

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

    const memberCount = await prisma.clubMembership.count({
      where: { clubId: managedClub.id },
    });
    const updatedClub = await prisma.club.update({
      where: { id: managedClub.id },
      data: { memberCount },
    });
    const displayMemberCount = displayClubMembers(
      managedClub.id,
      memberCount,
      updatedClub.memberDisplayBase,
    );

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

      try {
        const student = await prisma.user.findUnique({
          where: { id: params.studentId },
          select: { avatar: true },
        });
        const joinedAvatarUrl = resolveClubAvatar(student?.avatar, managedClub.name);
        await pusherServer.trigger(`club-${managedClub.id}`, "member-joined", {
          clubId: managedClub.id,
          memberCount,
          memberDisplayBase: updatedClub.memberDisplayBase,
          displayMemberCount,
          joinedAvatarUrl,
        });
      } catch {
        /* non-critical */
      }

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
