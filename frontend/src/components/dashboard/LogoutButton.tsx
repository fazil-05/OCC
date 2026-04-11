"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#8A8478] transition hover:text-[#F5F0E8]"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        const currentPath = window.location.pathname + window.location.search;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        router.refresh();
      }}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
