"use client";

import { toast } from "sonner";

export function AdminSettingsClient() {
  const refreshSession = async () => {
    const res = await fetch("/api/auth/refresh-session", { method: "POST" });
    if (!res.ok) {
      toast.error("Could not refresh session");
      return;
    }
    toast.success("Session refreshed from database");
  };

  return (
    <div className="rounded-2xl border border-[#C9A96E]/20 bg-[rgba(255,248,235,0.04)] p-6">
      <h2 className="font-serif text-xl italic text-[#F5F1EB]">Session</h2>
      <p className="mt-2 text-sm text-white/55">
        Re-issue your JWT from the database after role or suspension changes affect your account elsewhere.
      </p>
      <button
        type="button"
        onClick={refreshSession}
        className="mt-4 rounded-full border border-[#C9A96E]/50 bg-[#C9A96E]/15 px-5 py-2.5 text-sm font-medium text-[#C9A96E] transition hover:bg-[#C9A96E]/25"
      >
        Refresh session cookie
      </button>
    </div>
  );
}
