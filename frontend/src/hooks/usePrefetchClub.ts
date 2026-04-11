import { useCallback, useRef } from "react";

const prefetched = new Set<string>();

/**
 * Returns an onMouseEnter handler that prefetches a club page + API data.
 * Attach to club cards so the page loads instantly on click.
 *
 * Usage:
 *   const prefetchProps = usePrefetchClub(club.slug);
 *   <div {...prefetchProps}>...</div>
 */
export function usePrefetchClub(slug: string) {
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const onMouseEnter = useCallback(() => {
    if (prefetched.has(slug)) return;

    timer.current = setTimeout(() => {
      prefetched.add(slug);

      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = `/clubs/${slug}`;
      document.head.appendChild(link);

      fetch(`/api/clubs/${slug}`, { priority: "low" } as RequestInit).catch(
        () => {},
      );
    }, 100);
  }, [slug]);

  const onMouseLeave = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return { onMouseEnter, onMouseLeave };
}
