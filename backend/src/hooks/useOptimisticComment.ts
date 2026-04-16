import { useState, useCallback } from "react";

interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
  pending?: boolean;
}

/**
 * Optimistic comment creation hook.
 * Shows the comment in the feed immediately with a pending indicator,
 * then confirms or reverts after the server responds.
 *
 * Usage:
 *   const { comments, submitComment, pending } = useOptimisticComment({
 *     postId, initialComments, currentUser
 *   });
 */
export function useOptimisticComment({
  postId,
  initialComments = [],
  currentUser,
}: {
  postId: string;
  initialComments?: Comment[];
  currentUser: { id: string; fullName: string };
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [pending, setPending] = useState(false);

  const submitComment = useCallback(
    async (content: string) => {
      if (pending || !content.trim()) return;

      const tempId = `temp-${Date.now()}`;
      const optimistic: Comment = {
        id: tempId,
        content: content.trim(),
        userId: currentUser.id,
        userName: currentUser.fullName,
        createdAt: new Date().toISOString(),
        pending: true,
      };

      setComments((prev) => [...prev, optimistic]);
      setPending(true);

      try {
        const res = await fetch(`/api/posts/${postId}/comment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: content.trim() }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();

        // Replace the optimistic comment with the real one from the server
        setComments((prev) =>
          prev.map((c) =>
            c.id === tempId
              ? { ...data.comment, pending: false }
              : c,
          ),
        );
      } catch {
        // Revert: remove the optimistic comment
        setComments((prev) => prev.filter((c) => c.id !== tempId));
      } finally {
        setPending(false);
      }
    },
    [postId, currentUser, pending],
  );

  return { comments, submitComment, pending };
}
