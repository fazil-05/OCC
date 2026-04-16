"use client";

import { Menu, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export function TopBar({
  user,
}: {
  user: {
    fullName: string;
    email: string;
  };
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-40 mb-6 flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 backdrop-blur-xl lg:hidden">
        <Link href="/" className="inline-flex items-center gap-2 text-sm tracking-[0.28em] text-[#C9A96E]">
          <ShieldCheck className="h-4 w-4" />
          OCC
        </Link>
        <button type="button" className="text-[#F5F0E8]" onClick={() => setOpen((value) => !value)}>
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setOpen(false)}>
          <div className="h-full w-72 bg-[#0C0C0A]" onClick={(event) => event.stopPropagation()}>
            <Sidebar user={user} className="flex h-full w-full border-r-0" />
          </div>
        </div>
      ) : null}
    </>
  );
}
