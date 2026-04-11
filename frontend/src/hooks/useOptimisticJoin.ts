import { useState, useCallback } from "react";

/**
 * Optimistic join-club hook — updates UI instantly, reverts on failure.
 *
 * Usage:
 *   const { joined, pending, toggle } = useOptimisticJoin({ clubId, initialJoined });
 */
export function useOptimisticJoin({
  clubId,
  initialJoined,
}: {
  clubId: string;
  initialJoined: boolean;
}) {
  const [joined, setJoined] = useState(initialJoined);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  const toggle = useCallback(async () => {
    if (pending) return;

    const prev = joined;
    setJoined(!joined);
    setPending(true);
    setError(undefined);

    try {
      const res = await fetch(`/api/clubs/${clubId}/join`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to update membership");
      }
    } catch (e: any) {
      setJoined(prev);
      setError(e.message);
    } finally {
      setPending(false);
    }
  }, [clubId, joined, pending]);

  return { joined, pending, error, toggle };
}
