import { useState, useEffect, useCallback, useRef } from "react";

const memoryCache = new Map<string, { data: unknown; fetchedAt: number }>();

interface SWROptions {
  /** Max age in ms before background revalidation (default 10000) */
  maxAge?: number;
  /** Skip fetching entirely */
  skip?: boolean;
}

/**
 * Stale-while-revalidate hook.
 * Shows cached data instantly, then quietly refreshes in background.
 * Pusher events can call `mutate()` to inject fresh data without a fetch.
 */
export function useStaleWhileRevalidate<T>(
  key: string,
  fetcher: () => Promise<T>,
  opts: SWROptions = {},
) {
  const { maxAge = 10_000, skip = false } = opts;
  const cached = memoryCache.get(key);
  const [data, setData] = useState<T | undefined>(cached?.data as T);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<Error>();
  const mountedRef = useRef(true);

  const revalidate = useCallback(async () => {
    try {
      const fresh = await fetcher();
      memoryCache.set(key, { data: fresh, fetchedAt: Date.now() });
      if (mountedRef.current) {
        setData(fresh);
        setError(undefined);
      }
    } catch (e) {
      if (mountedRef.current) setError(e as Error);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [key, fetcher]);

  const mutate = useCallback(
    (fresh: T) => {
      memoryCache.set(key, { data: fresh, fetchedAt: Date.now() });
      setData(fresh);
    },
    [key],
  );

  useEffect(() => {
    mountedRef.current = true;
    if (skip) return;

    if (cached && Date.now() - cached.fetchedAt < maxAge) {
      setData(cached.data as T);
      setLoading(false);
    } else {
      revalidate();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [key, skip]);

  return { data, loading, error, revalidate, mutate };
}
