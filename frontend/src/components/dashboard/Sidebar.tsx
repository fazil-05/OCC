"use client";

import { BriefcaseBusiness, CalendarDays, Compass, Grid2x2, ShieldCheck, User2, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { cn } from "@/app/components/ui/utils";

const items = [
  { href: "/dashboard", label: "Home Feed", icon: Grid2x2 },
  { href: "/explore", label: "Explore Clubs", icon: Compass },
  { href: "/clubs", label: "My Clubs", icon: Users },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/gigs", label: "Gigs", icon: BriefcaseBusiness },
  { href: "/profile", label: "Profile", icon: User2 },
];

export function Sidebar({
  user,
  className,
}: {
  user: {
    fullName: string;
    email: string;
  };
  className?: string;
}) {
  const pathname = usePathname();
  const initials = user.fullName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <aside
      className={cn(
        "hidden h-screen w-60 flex-col border-r border-white/6 bg-[#0C0C0A]/90 px-4 py-6 lg:flex",
        className,
      )}
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C9A96E]/40 bg-[#C9A96E]/12 text-sm font-semibold text-[#F5F0E8]">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#F5F0E8]">{user.fullName}</p>
          <p className="truncate text-xs text-[#8A8478]">{user.email}</p>
        </div>
      </div>

      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm tracking-[0.28em] text-[#C9A96E]">
        <ShieldCheck className="h-4 w-4" />
        OCC
      </Link>

      <nav className="space-y-1.5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md border-l-2 border-transparent px-4 py-3 text-[12px] uppercase tracking-[0.2em] text-[#8A8478] transition",
                active
                  ? "border-[#C9A96E] bg-white/[0.06] text-[#F5F0E8]"
                  : "hover:bg-white/[0.03] hover:text-[#F5F0E8]",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 border-t border-white/6 pt-6">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#4A4840]">Season 1 · Bangalore</p>
        <LogoutButton />
      </div>
    </aside>
  );
}
