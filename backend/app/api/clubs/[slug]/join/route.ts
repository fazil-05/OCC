import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { displayClubMembers } from "@/lib/socialDisplay";
import { pusherServer } from "@/lib/pusher";
import { resolveClubAvatar } from "@/lib/postImageUrl";

export async function POST(_req: NextRequest, { params }: { params: { slug: string } }) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const club = await prisma.club.findUnique({
    where: { slug: params.slug },
  });

  if (!club) {
    return NextResponse.json({ error: "Club not found" }, { status: 404 });
  }

  await prisma.clubMembership.upsert({
    where: {
      userId_clubId: {
        userId: user.id,
        clubId: club.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      clubId: club.id,
    },
  });

  const updatedClub = await prisma.club.update({
    where: { id: club.id },
    data: {
      memberCount: await prisma.clubMembership.count({
        where: { clubId: club.id },
      }),
    },
  });

  const displayMemberCount = displayClubMembers(
    club.id,
    updatedClub.memberCount,
    updatedClub.memberDisplayBase,
  );
  const joinedAvatarUrl = resolveClubAvatar(user.avatar, club.name);

  await pusherServer.trigger(`club-${club.id}`, "member-joined", {
    clubId: club.id,
    memberCount: updatedClub.memberCount,
    memberDisplayBase: updatedClub.memberDisplayBase,
    displayMemberCount,
    joinedAvatarUrl,
  });

  return NextResponse.json({
    success: true,
    memberCount: updatedClub.memberCount,
    displayMemberCount,
  });
}
