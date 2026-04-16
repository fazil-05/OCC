"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { OCCPostCard, type OCCPost } from "@/components/occ-dashboard/OCCPostCard";
import { resolveClubAvatar, resolvePostImageUrlForFeed } from "@/lib/postImageUrl";

type FeedFilter = "for-you" | "following" | "all-clubs";

type ApiPost = {
  id: string;
  clubId: string;
  caption: string | null;
  content: string | null;
  imageUrl: string | null;
  imageUrls?: string[] | null;
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
  createdAt: string;
  user: { id: string; fullName: string; avatar: string | null };
  club: { id: string; name: string; clubMembersLabel?: string } | null;
};

function getTimeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
}

function toCards(posts: ApiPost[]): OCCPost[] {
  return posts.map((p) => {
    const postImg = resolvePostImageUrlForFeed(p.imageUrl, p.club?.name || "");
    const imageUrls =
      Array.isArray(p.imageUrls) && p.imageUrls.length > 0
        ? p.imageUrls.map((img) => resolvePostImageUrlForFeed(img, p.club?.name || ""))
        : [postImg];
    return {
      id: p.id,
      username: p.user.fullName,
      userAvatarUrl: resolveClubAvatar(p.user.avatar, p.club?.name || "OCC"),
      timestamp: getTimeAgo(p.createdAt),
      caption: p.caption || "",
      content: p.content || "",
      imageUrl: postImg,
      imageUrls,
      likeCount: p.likesCount,
      sharesCount: p.sharesCount,
      commentsCount: p.commentsCount,
      clubId: p.clubId,
      clubName: p.club?.name || "OCC Club",
      clubMembersLabel: p.club?.clubMembersLabel,
    };
  });
}

const FILTER_META: Record<FeedFilter, { label: string }> = {
  "for-you": { label: "For You" },
  following: { label: "Following" },
  "all-clubs": { label: "All Clubs" },
};

export function RealtimeFeedTabs({
  initialPosts,
  currentUserId,
}: {
  initialPosts: OCCPost[];
  currentUserId: string;
}) {
  const [activeFilter, setActiveFilter] = useState<FeedFilter>("for-you");
  const [postsByFilter, setPostsByFilter] = useState<Record<FeedFilter, OCCPost[]>>({
    "for-you": initialPosts,
    following: [],
    "all-clubs": [],
  });
  const [loadedByFilter, setLoadedByFilter] = useState<Record<FeedFilter, boolean>>({
    "for-you": initialPosts.length > 0,
    following: false,
    "all-clubs": false,
  });
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadFilter = useCallback(
    async (filter: FeedFilter, silent = false) => {
      if (!silent) setLoading(true);
      try {
        const res = await fetch(`/api/dashboard/feed?filter=${filter}&limit=30`, {
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`feed load failed: ${res.status}`);
        const data = (await res.json()) as { posts: ApiPost[] };
        setPostsByFilter((prev) => ({ ...prev, [filter]: toCards(data.posts || []) }));
        setLoadedByFilter((prev) => ({ ...prev, [filter]: true }));
        setLoadError(null);
      } catch {
        if (!silent) setLoadError("Could not refresh this feed.");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (loadedByFilter[activeFilter]) return;
    void loadFilter(activeFilter);
  }, [activeFilter, loadFilter, loadedByFilter]);

  useEffect(() => {
    let timer: number | null = null;

    const start = () => {
      if (timer !== null) window.clearInterval(timer);
      timer = window.setInterval(() => {
        if (document.visibilityState !== "visible") return;
        void loadFilter(activeFilter, true);
      }, 5000);
    };

    start();
    return () => {
      if (timer !== null) window.clearInterval(timer);
    };
  }, [activeFilter, loadFilter]);

  const activePosts = useMemo(() => postsByFilter[activeFilter] || [], [postsByFilter, activeFilter]);

  return (
    <>
      <div className="flex items-center justify-between mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-black/5 mt-2 sm:mt-4 gap-4 px-4 sm:px-0">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 lg:pb-0">
          {(Object.keys(FILTER_META) as FeedFilter[]).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-[13px] font-medium tracking-wide uppercase transition-all shrink-0 ${
                activeFilter === filter
                  ? "bg-black text-white shadow-xl shadow-black/10"
                  : "text-black/30 hover:text-black/60 hover:bg-black/5"
              }`}
            >
              {FILTER_META[filter].label}
            </button>
          ))}
        </div>


      </div>

      {loadError ? (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      ) : null}

      {loading && activePosts.length === 0 ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl bg-slate-200/60" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {activePosts.map((p) => (
            <OCCPostCard key={p.id} post={p} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </>
  );
}
