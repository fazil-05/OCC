"use client";

import { useRealtimeMembers } from "@/components/realtime/useRealtimeMembers";

export function RealtimeMemberFeed({
  headerId,
  initialMembers,
}: {
  headerId: string;
  initialMembers: { id: string; fullName: string; collegeName: string; registeredAt: string }[];
}) {
  const { members } = useRealtimeMembers(headerId, initialMembers);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="mb-2 text-xs uppercase tracking-widest text-[#C9A96E]">Just joined</p>
      <div className="space-y-2">
        {members.map((m) => (
          <p key={m.id} className="text-sm text-white/80">{m.fullName} joined</p>
        ))}
      </div>
    </div>
  );
}
