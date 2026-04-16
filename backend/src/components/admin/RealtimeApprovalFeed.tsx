"use client";

import { useAdminRealtime } from "@/components/realtime/useAdminRealtime";

export function RealtimeApprovalFeed({
  initialApplications,
}: {
  initialApplications: { id: string; fullName: string; club: string; email: string }[];
}) {
  const { applications } = useAdminRealtime(initialApplications);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="mb-2 text-xs uppercase tracking-widest text-[#C9A96E]">Live applications</p>
      <div className="space-y-2">
        {applications.slice(0, 10).map((a) => (
          <p key={a.id} className="text-sm text-white/80">{a.fullName} · {a.club}</p>
        ))}
      </div>
    </div>
  );
}
