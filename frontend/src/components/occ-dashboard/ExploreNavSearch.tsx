"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

/**
 * Renders only on `/explore`. Lives in OCCHeader so the search stays fixed with the top bar.
 * Query is synced to `?q=` so ExploreClient and this input share one source of truth.
 */
export function ExploreNavSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();
  const isExplore = pathname === "/explore";

  const [input, setInput] = useState(() => sp.get("q") ?? "");

  useEffect(() => {
    if (!isExplore) return;
    setInput(sp.get("q") ?? "");
  }, [isExplore, sp]);

  useEffect(() => {
    if (!isExplore) return;
    const t = window.setTimeout(() => {
      const next = input.trim();
      const cur = sp.get("q") ?? "";
      if (next === cur) return;
      const url = next ? `/explore?q=${encodeURIComponent(next)}` : "/explore";
      router.replace(url, { scroll: false });
    }, 280);
    return () => window.clearTimeout(t);
  }, [input, isExplore, router, sp]);

  if (!isExplore) return null;

  return (
    <div className="relative w-full min-w-0 max-w-xl">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 sm:left-4" />
      <input
        type="search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search posts, clubs, keywords…"
        autoComplete="off"
        className="h-10 w-full rounded-2xl border border-black/[0.06] bg-white/90 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-[#5227FF]/40 sm:h-11 sm:pl-11 sm:pr-4"
      />
    </div>
  );
}
