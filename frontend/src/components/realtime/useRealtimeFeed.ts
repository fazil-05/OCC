"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";

type Post = {
  id: string;
  likesCount?: number;
  likes?: number;
};

export function useRealtimeFeed(clubId: string, initialPosts: Post[]) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  useEffect(() => {
    if (!pusherClient || !clubId) return;
    const client = pusherClient;
    const channelName = `club-${clubId}`;
    const channel = client.subscribe(channelName);

    channel.bind("new-post", (data: { post: Post }) => {
      setPosts((prev) => [data.post, ...prev]);
    });

    channel.bind("new-like", (data: { postId: string; likesCount: number }) => {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === data.postId ? { ...p, likesCount: data.likesCount, likes: data.likesCount } : p,
        ),
      );
    });

    return () => {
      channel.unbind_all();
      client.unsubscribe(channelName);
    };
  }, [clubId]);

  return { posts, setPosts };
}
