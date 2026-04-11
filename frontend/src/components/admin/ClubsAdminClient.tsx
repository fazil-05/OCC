"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { staffHref } from "@/lib/staff-paths";

export type ClubRow = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  theme: string;
  memberCount: number;
  postingFrozen: boolean;
  header: { id: string; fullName: string; email: string } | null;
};

export function ClubsAdminClient({ clubs: initial }: { clubs: ClubRow[] }) {
  const [clubs, setClubs] = useState(initial);

  const toggleFreeze = async (id: string, next: boolean) => {
    const res = await fetch(`/api/admin/clubs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postingFrozen: next }),
    });
    if (!res.ok) {
      toast.error("Update failed");
      return;
    }
    setClubs((prev) => prev.map((c) => (c.id === id ? { ...c, postingFrozen: next } : c)));
    toast.success(next ? "Posting frozen" : "Posting enabled");
  };

  const unassignHeader = async (id: string) => {
    const res = await fetch(`/api/admin/clubs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ headerId: null }),
    });
    if (!res.ok) {
      toast.error("Unassign failed");
      return;
    }
    setClubs((prev) => prev.map((c) => (c.id === id ? { ...c, header: null } : c)));
    toast.success("Header unassigned");
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-[#C9A96E]">Directory</p>
        <h1 className="font-serif text-3xl italic text-[#F5F1EB] md:text-4xl">All clubs</h1>
      </div>
      <div className="grid gap-4">
        {clubs.map((c) => (
          <div
            key={c.id}
            className="flex flex-col gap-4 rounded-2xl border border-[#C9A96E]/20 bg-[rgba(255,248,235,0.04)] p-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{c.icon}</span>
              <div>
                <p className="text-lg font-medium text-[#F5F1EB]">{c.name}</p>
                <p className="font-mono text-xs text-white/50">
                  {c.slug} · {c.memberCount} members · theme {c.theme}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  Header:{" "}
                  {c.header ? (
                    <span className="text-[#C9A96E]">{c.header.fullName}</span>
                  ) : (
                    <span className="text-white/40">Unassigned</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toggleFreeze(c.id, !c.postingFrozen)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
                  c.postingFrozen
                    ? "bg-[#00E87A]/20 text-[#00E87A]"
                    : "border border-white/20 text-white/80"
                }`}
              >
                {c.postingFrozen ? "Enable posting" : "Freeze posting"}
              </button>
              {c.header ? (
                <button
                  type="button"
                  onClick={() => unassignHeader(c.id)}
                  className="rounded-full border border-[#FF4D4D]/50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#FF4D4D]"
                >
                  Unassign header
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-white/40">
        Need to reassign a leader? Approve them first, then set header from user tools (phase 2) or DB.
      </p>
      <div className="text-center">
        <Link href={staffHref("/approvals")} className="text-sm text-[#C9A96E] underline-offset-4 hover:underline">
          Go to approvals
        </Link>
      </div>
    </div>
  );
}
