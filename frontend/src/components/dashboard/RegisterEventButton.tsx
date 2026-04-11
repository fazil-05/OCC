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
      disabled={registered || loading}
      className="rounded-xl bg-[#5227FF] px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.24em] text-white transition-all hover:bg-[#401ED9] hover:shadow-lg hover:shadow-[#5227FF]/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
      onClick={async () => {
        setLoading(true);
        const response = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId }),
        });
        setLoading(false);
        if (response.ok) {
          router.refresh();
        }
      }}
    >
      {registered ? "Registered ✓" : loading ? "Registering..." : "Register →"}
    </button>
  );
}
