"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Filter } from "lucide-react";
import { CLUB_HUB_CATEGORIES } from "@/lib/clubCategoryFilter";

function useDebouncedValue<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setV(value), ms);
    return () => window.clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function ClubsHubControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const catFromUrl = searchParams.get("cat") || "all";
  const qFromUrl = searchParams.get("q") || "";

  const [searchDraft, setSearchDraft] = useState(qFromUrl);
  const debouncedQ = useDebouncedValue(searchDraft, 320);

  useEffect(() => {
    setSearchDraft(qFromUrl);
  }, [qFromUrl]);

  const pushParams = useCallback(
    (next: { cat?: string; q?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      const cat = next.cat ?? params.get("cat") ?? "all";
      const qRaw = next.q !== undefined ? next.q : params.get("q") ?? "";
      if (cat && cat !== "all") params.set("cat", cat);
      else params.delete("cat");
      const qTrim = qRaw.trim();
      if (qTrim) params.set("q", qTrim);
      else params.delete("q");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  useEffect(() => {
    const qTrim = debouncedQ.trim();
    const urlQ = (searchParams.get("q") || "").trim();
    if (qTrim === urlQ) return;
    pushParams({ q: debouncedQ });
  }, [debouncedQ, pushParams, searchParams]);

  const activeCat = useMemo(() => {
    const valid = CLUB_HUB_CATEGORIES.some((c) => c.key === catFromUrl);
    return valid ? catFromUrl : "all";
  }, [catFromUrl]);

  return (
    <div className="mb-6 sm:mb-10 space-y-4 sm:space-y-5 border-b border-black/[0.05] pb-6 sm:pb-10">
      <div className="w-full overflow-x-auto scrollbar-hide sm:px-0 pb-1">
        <div className="flex w-max min-w-full items-center gap-2 sm:gap-2.5">
          {CLUB_HUB_CATEGORIES.map(({ key, label }) => {
            const active = activeCat === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => pushParams({ cat: key })}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-[10px] font-black uppercase tracking-wide shadow-sm transition-all duration-300 sm:px-6 sm:py-3 sm:text-[12px] ${
                  active
                    ? "border-black bg-black text-white shadow-xl"
                    : "border-black/5 bg-white text-black/40 hover:border-black/20"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:px-0 sm:max-w-xl">
        <div className="relative min-w-0 flex-1">
          <input
            type="search"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Search clubs..."
            className="h-12 w-full rounded-xl border border-black/5 bg-white py-2 pl-10 pr-4 text-[13px] font-bold text-black shadow-sm outline-none transition-all placeholder:text-black/20 focus:border-[#5227FF]/30 sm:h-14 sm:rounded-2xl sm:pl-14 sm:text-[14px]"
            autoComplete="off"
          />
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/20 sm:left-5 sm:h-5 sm:w-5"
            strokeWidth={3}
          />
        </div>

      </div>
    </div>
  );
}
