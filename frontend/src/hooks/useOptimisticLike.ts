import { useState, useCallback } from "react";

interface UseOptimisticLikeOptions {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
}

/**
 * Optimistic like toggle — updates UI instantly, reverts on failure.
 * Drop-in replacement for components that call POST /api/posts/[id]/like.
 */
export function useOptimisticLike({
  postId,
  initialLiked,
  initialCount,
}: UseOptimisticLikeOptions) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);

  const toggle = useCallback(async () => {
    if (pending) return;

    const prevLiked = liked;
    const prevCount = count;

    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);
    setPending(true);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (typeof data.liked === "boolean") setLiked(data.liked);
      if (typeof data.count === "number") setCount(data.count);
    } catch {
      setLiked(prevLiked);
      setCount(prevCount);
    } finally {
      setPending(false);
    }
  }, [postId, liked, count, pending]);

  return { liked, count, pending, toggle };
}
