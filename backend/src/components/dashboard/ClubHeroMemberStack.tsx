"use client";

import { useEffect, useMemo, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { displayClubMembers, formatSocialCount } from "@/lib/socialDisplay";
import { padHeroAvatarsToThree, type HeroAvatar } from "@/lib/clubHeroAvatars";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";

type MemberJoinedPayload = {
  clubId?: string;
  memberCount?: number;
  memberDisplayBase?: number | null;
  displayMemberCount?: number;
  /** Public CDN URL for the user who just joined (no user id). */
  joinedAvatarUrl?: string | null;
  joinedUserName?: string | null;
};

function getFallbackColor(name: string) {
  const colors = [
    "bg-red-700", "bg-emerald-800", "bg-blue-700", "bg-amber-700", 
    "bg-indigo-700", "bg-rose-700", "bg-cyan-700", "bg-orange-800"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function ClubHeroMemberStack({
  clubId,
  initialAvatarUrls,
  initialMemberCount,
  memberDisplayBase,
}: {
  clubId: string;
  initialAvatarUrls: HeroAvatar[];
  initialMemberCount: number;
  memberDisplayBase: number | null;
}) {
  const [avatarUrls, setAvatarUrls] = useState<HeroAvatar[]>(() => initialAvatarUrls.slice(0, 3));
  const [memberCount, setMemberCount] = useState(initialMemberCount);
  const [displayBase, setDisplayBase] = useState<number | null>(memberDisplayBase);

  const displayLabel = useMemo(
    () => formatSocialCount(displayClubMembers(clubId, memberCount, displayBase)),
    [clubId, memberCount, displayBase],
  );

  const avatarSig = initialAvatarUrls.map((a) => a.url).join("|");

  useEffect(() => {
    setAvatarUrls(initialAvatarUrls.slice(0, 3));
    setMemberCount(initialMemberCount);
    setDisplayBase(memberDisplayBase);
  }, [avatarSig, clubId, initialAvatarUrls, initialMemberCount, memberDisplayBase]);

  useEffect(() => {
    if (!pusherClient) return;
    const channel = pusherClient.subscribe(`club-${clubId}`);
    const onJoin = (raw: unknown) => {
      const data = raw as MemberJoinedPayload;
      if (data.clubId && data.clubId !== clubId) return;
      if (typeof data.memberCount === "number") {
        setMemberCount(data.memberCount);
      }
      if (data.memberDisplayBase !== undefined) {
        setDisplayBase(data.memberDisplayBase ?? null);
      }
      const url = typeof data.joinedAvatarUrl === "string" ? data.joinedAvatarUrl.trim() : "";
      const name = typeof data.joinedUserName === "string" ? data.joinedUserName.trim() : "";
      
      setAvatarUrls((prev) => {
        const fallback = (name || "O")[0].toUpperCase();
        // Since we don't have a unique ID in the payload easily here (pusher data is minimal), 
        // we'll just check if the URL or Name is already at the top.
        const isDuplicate = prev.some(a => (url && a.url === url) || (!url && a.fallback === fallback));
        if (isDuplicate) return prev;
        
        return [{ url, fallback }, ...prev].slice(0, 3);
      });
    };
    channel.bind("member-joined", onJoin);
    return () => {
      channel.unbind("member-joined", onJoin);
      pusherClient?.unsubscribe(`club-${clubId}`);
    };
  }, [clubId]);

  return (
    <div className="flex items-center -space-x-3" aria-label="Active members">
      {avatarUrls.map((av, i) => (
        <Avatar
          key={`${i}-${av.url.slice(-24)}`}
          className="h-10 w-10 border-2 border-white shadow-sm"
        >
          <AvatarImage src={av.url} alt={av.fallback} className="object-cover" />
          <AvatarFallback className={`${getFallbackColor(av.fallback)} text-white font-bold text-sm`}>
            {av.fallback}
          </AvatarFallback>
        </Avatar>
      ))}
      <span className="pl-6 text-[13px] font-bold text-slate-400">
        {displayLabel} members active
      </span>
    </div>
  );
}
