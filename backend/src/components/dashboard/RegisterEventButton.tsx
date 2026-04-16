"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

export function RegisterEventButton({
  eventId,
  registered,
}: {
  eventId: string;
  registered: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      className={registered 
        ? "group/unreg rounded-xl bg-[#5227FF]/10 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.24em] text-[#5227FF] transition-all hover:bg-black hover:text-white hover:shadow-lg hover:shadow-black/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40" 
        : "rounded-xl bg-[#5227FF] px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.24em] text-white transition-all hover:bg-[#401ED9] hover:shadow-lg hover:shadow-[#5227FF]/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"}
      onClick={async () => {
        setLoading(true);
        const method = registered ? "DELETE" : "POST";
        const response = await fetch("/api/events", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId }),
        });
        setLoading(false);
        if (response.ok) {
          router.refresh();
        }
      }}
    >
      {loading ? "..." : registered ? (
        <>
          <span className="block group-hover/unreg:hidden">Registered ✓</span>
          <span className="hidden group-hover/unreg:block">Unregister</span>
        </>
      ) : "Register →"}
    </button>
  );
}
