"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenSquare,
  Users,
  Link2,
  TrendingUp,
  CalendarDays,
  Briefcase,
  ChevronRight,
  MoreHorizontal,
  Search,
  Copy,
  LogOut,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLogout } from "@/hooks/useLogout";
import { OCC_BRAND_ICON } from "@/lib/brand";

type NavItem = {
  path: string;
  label: string;
  icon: React.ElementType;
};

const nav: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/post", label: "Post", icon: PenSquare },
  { path: "/members", label: "Members", icon: Users },
  { path: "/gigs", label: "Gigs", icon: Briefcase },
  { path: "/referral", label: "Referral", icon: Link2 },
  { path: "/analytics", label: "Analytics", icon: TrendingUp },
  { path: "/events", label: "Events", icon: CalendarDays },
  { path: "/profile", label: "Profile", icon: User },
];

const navWithHref = nav.map((item) => ({
  ...item,
  href: `/header${item.path}`,
}));

interface ClubHeaderShellProps {
  children: React.ReactNode;
  user: {
    fullName: string;
    email: string;
    referralCode: string | null;
    clubName: string;
    clubIcon: string;
  };
}

export function ClubHeaderShell({ children, user }: ClubHeaderShellProps) {
  const pathname = usePathname() || "";
  const logout = useLogout();
  const [mounted, setMounted] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyCode = async () => {
    if (!user.referralCode) return;
    await navigator.clipboard.writeText(user.referralCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 1500);
  };

  return (
    <div className="relative min-h-screen bg-[#070914] text-[#F5F1EB] overflow-hidden">
      {/* Background radial blurs for glassmorphism effect */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#5227FF] opacity-[0.12] blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4AF37] opacity-[0.05] blur-[150px] pointer-events-none" />
      <div className="fixed top-[40%] right-[-10%] w-[30%] h-[40%] rounded-full bg-[#8C6DFD] opacity-[0.06] blur-[100px] pointer-events-none" />

      <div className="flex h-screen max-w-[1920px] mx-auto relative z-10 w-full">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -250, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden w-[300px] flex-col border-r border-[#5227FF]/20 bg-white/[0.02] backdrop-blur-3xl md:flex z-50 pt-2 pb-6 px-4"
        >
          {/* Logo Section */}
          <div className="flex items-center gap-4 px-2 py-8 group cursor-pointer mb-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-[0_0_25px_rgba(82,39,255,0.5)] group-hover:shadow-[0_0_35px_rgba(82,39,255,0.7)] transition-shadow duration-500">
              <img
                src={OCC_BRAND_ICON}
                alt="OCC"
                className="h-full w-full object-cover"
                width={48}
                height={48}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg tracking-tight text-white font-semibold truncate max-w-[180px]">
                {user.clubName}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
                Leader Panel
              </span>
            </div>
          </div>

          {/* Referral Code Mini Widget */}
          {user.referralCode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mx-2 mb-6 rounded-2xl bg-gradient-to-br from-[#5227FF]/15 to-transparent border border-[#5227FF]/20 p-4"
            >
              <p className="text-[10px] uppercase tracking-widest text-white/50 mb-2">Your Code</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-bold tracking-[0.2em] text-[#8C6DFD]">
                  {user.referralCode}
                </span>
                <button
                  onClick={copyCode}
                  className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#5227FF] transition-colors"
                >
                  <Copy className={`h-3.5 w-3.5 ${codeCopied ? "text-[#00E87A]" : "text-white/50"}`} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto w-full scrollbar-hide py-2">
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold px-5 mb-4">
              Navigation
            </p>
            <nav className="space-y-[2px] w-full flex flex-col gap-1">
              {navWithHref.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link href={href} key={href} className="relative block w-full">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`relative flex items-center gap-4 rounded-2xl px-5 py-3.5 transition-all duration-300 z-10 w-full ${
                        active
                          ? "text-white"
                          : "text-white/40 hover:text-white/90 hover:bg-white/[0.04]"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${active ? "text-white" : ""}`} strokeWidth={active ? 2.5 : 2} />
                      <span className={`text-[15px] ${active ? "font-semibold" : "font-medium"} tracking-wide`}>
                        {label}
                      </span>
                    </motion.div>
                    {active && mounted && (
                      <motion.div
                        layoutId="header-sidebar-active"
                        className="absolute inset-0 z-0 rounded-2xl bg-gradient-to-r from-[#5227FF]/25 to-transparent border-l-2 border-[#5227FF]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer User Profile */}
          <div className="mt-auto px-2">
            <div className="flex items-center justify-between group cursor-pointer rounded-[1.25rem] bg-white/[0.02] border border-white/[0.05] p-3 hover:bg-white/[0.04] hover:border-[#5227FF]/30 transition-all shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#12183A] to-[#0A0D20] border border-[#5227FF]/40 text-sm font-bold text-white shadow-[0_0_15px_rgba(82,39,255,0.3)]">
                  {user.fullName.charAt(0)}
                </div>
                <div className="flex flex-col max-w-[130px]">
                  <span className="text-[14px] font-semibold text-white/90 truncate">{user.fullName}</span>
                  <span className="text-[10px] font-medium text-white/40 truncate">{user.email}</span>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-white/[0.04] flex items-center justify-center">
                <MoreHorizontal className="h-4 w-4 text-white/25" />
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden relative z-10">
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-between border-b border-white/[0.05] bg-white/[0.01] backdrop-blur-2xl px-6 py-4 md:px-10 z-30 sticky top-0"
          >
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <span className="text-xs font-semibold text-white/50">Home</span>
              <ChevronRight className="h-3 w-3 text-white/30" />
              <span className="text-xs font-semibold text-white">Club Panel</span>
              <ChevronRight className="h-3 w-3 text-white/30" />
              <span className="text-xs font-semibold text-[#5227FF]">
                {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </span>
            </div>

            <div className="flex flex-1 justify-end items-center gap-4 lg:gap-6">
              <div className="relative hidden w-full max-w-md lg:block group">
                <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/30 group-focus-within:text-[#5227FF] transition-colors" />
                <div className="w-full rounded-full border border-white/[0.08] bg-black/30 py-3 pl-12 pr-4 text-sm text-white/40 shadow-inner">
                  Search members (coming soon)
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-white/75 hover:border-red-500/35 hover:bg-red-500/10 hover:text-red-200 transition-colors"
                >
                  <LogOut className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                  <span className="hidden sm:inline">Log out</span>
                </button>
                <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <div className="h-full w-full bg-gradient-to-br from-[#5227FF] to-[#8C6DFD] flex items-center justify-center text-white font-bold text-sm">
                    {user.fullName.charAt(0)}
                  </div>
                </div>
              </div>
            </div>
          </motion.header>

          <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 scrollbar-hide relative z-10 w-full max-w-[1400px] mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
