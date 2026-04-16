import type { User } from "@prisma/client";
import { resolveClubAvatar } from "@/lib/postImageUrl";

export type HeroAvatar = {
  url: string;
  fallback: string;
};

type MemberRow = {
  userId: string;
  user: Pick<User, "avatar" | "role" | "clubManagedId" | "fullName">;
};

/**
 * Up to three unique public avatar URLs for the club hero: header first, then
 * club headers among members, then recent members. No PII beyond image URLs.
 */
export function clubHeroAvatarUrls(
  club: { id: string; name: string; header: (Pick<User, "id" | "avatar" | "role" | "clubManagedId" | "fullName"> | null) },
  members: MemberRow[],
): HeroAvatar[] {
  const out: HeroAvatar[] = [];
  const seenIds = new Set<string>();

  const push = (userId: string | undefined, avatar: string | null | undefined, name: string | null | undefined) => {
    if (userId && seenIds.has(userId)) return;
    if (userId) seenIds.add(userId);
    
    const url = resolveClubAvatar(avatar, club.name);
    const fallback = (name || "O")[0].toUpperCase();
    out.push({ url, fallback });
  };

  if (club.header) {
    push(club.header.id, club.header.avatar, club.header.fullName);
  }

  const sorted = [...members].sort((a, b) => {
    const aHdr = a.user.role === "CLUB_HEADER" && a.user.clubManagedId === club.id ? 1 : 0;
    const bHdr = b.user.role === "CLUB_HEADER" && b.user.clubManagedId === club.id ? 1 : 0;
    return bHdr - aHdr;
  });

  for (const m of sorted) {
    if (out.length >= 3) break;
    push(m.userId, m.user.avatar, m.user.fullName);
  }

  return out;
}

/** No deterministic filler faces as per user request. Just return available members. */
export function padHeroAvatarsToThree(urls: HeroAvatar[]): HeroAvatar[] {
  return urls.slice(0, 3);
}
