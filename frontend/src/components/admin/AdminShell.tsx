"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CheckCircle2,
  Grid3X3,
  Users,
  Image as ImageIcon,
  TrendingUp,
  Settings,
  Search,
  ChevronRight,
  MoreHorizontal,
  LogOut,
  Bell,
  AlertOctagon,
  Briefcase,
  Orbit,
} from "lucide-react";
import { NotificationBell } from "@/components/realtime/NotificationBell";
import { STAFF_PUBLIC_PREFIX, staffHref } from "@/lib/staff-paths";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useLogout } from "@/hooks/useLogout";
import { OCC_BRAND_ICON } from "@/lib/brand";

type NavItem = {
  path: string;
  label: string;
  icon: React.ElementType;
  badgeKey?: string;
};

const nav: NavItem[] = [
  { path: "", label: "Overview", icon: LayoutDashboard },
  { path: "/approvals", label: "Approvals", icon: CheckCircle2, badgeKey: "pending" },
  { path: "/clubs", label: "All Clubs", icon: Grid3X3 },
  { path: "/users", label: "All Users", icon: Users },
  { path: "/posts", label: "All Posts", icon: ImageIcon },
  { path: "/gigs", label: "Gigs & hires", icon: Briefcase },
  { path: "/reports", label: "Intel Reports", icon: AlertOctagon },
  { path: "/orbit", label: "Orbit Gallery", icon: Orbit },
  { path: "/analytics", label: "Analytics", icon: TrendingUp },
  { path: "/settings", label: "Settings", icon: Settings },
];

const navWithHref = nav.map((item) => ({ 
  ...item, 
  href: staffHref(item.path) 
}));

export function AdminShell({
  children,
  pendingCount,
  adminUser,
}: {
  children: React.ReactNode;
  pendingCount: number;
  adminUser: {
    id: string;
    fullName: string;
    email: string;
    notifications: { id: string; title: string; message: string; read: boolean; createdAt: Date }[];
  };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#070914] text-[#F5F1EB] overflow-hidden">
      {/* Background radial blurs for glassmorphism effect */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#5227FF] opacity-[0.12] blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4AF37] opacity-[0.05] blur-[150px] pointer-events-none" />
      <div className="fixed top-[40%] right-[-10%] w-[30%] h-[40%] rounded-full bg-[#8C6DFD] opacity-[0.06] blur-[100px] pointer-events-none" />

      <div className="flex h-screen max-w-[1920px] mx-auto relative z-10 w-full">
        {/* DESKTOP SIDEBAR */}
        <motion.aside 
          initial={{ x: -250, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden w-[300px] flex-col border-r border-[#5227FF]/20 bg-white/[0.02] backdrop-blur-3xl md:flex z-50 pt-2 pb-6 px-4"
        >
          {/* Logo Section */}
          <div className="flex items-center gap-4 px-2 py-8 group cursor-pointer mb-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-[0_0_25px_rgba(82,39,255,0.5)] group-hover:shadow-[0_0_35px_rgba(82,39,255,0.7)] transition-shadow duration-500">
              <img
                src={OCC_BRAND_ICON}
                alt="OCC"
                className="h-full w-full object-cover"
                width={44}
                height={44}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl tracking-wide text-white flex items-center gap-1.5 font-semibold">
                OCC 
                <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[9px] uppercase tracking-widest border border-white/20">Admin</span>
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto w-full scrollbar-hide py-2">
            <nav className="space-y-[2px] w-full flex flex-col gap-1">
              {navWithHref.map(({ href, label, icon: Icon, badgeKey }) => {
                const active =
                  pathname === href || (href !== STAFF_PUBLIC_PREFIX && pathname.startsWith(href + "/"));
                const badge =
                  badgeKey === "pending" && pendingCount > 0 ? (
                    <div className="ml-auto flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#00E87A] px-2 text-[11px] font-extrabold text-[#070914] shadow-[0_0_12px_rgba(0,232,122,0.6)]">
                      {pendingCount}
                    </div>
                  ) : null;
                return (
                  <Link href={href} key={href} className="relative block w-full">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`relative flex items-center justify-between gap-4 rounded-2xl px-5 py-3.5 transition-all duration-300 z-10 w-full ${
                        active
                          ? "text-white"
                          : "text-white/40 hover:text-white/90 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Icon className={`h-5 w-5 ${active ? "text-white" : ""}`} strokeWidth={active ? 2.5 : 2} />
                        <span className={`text-[15px] ${active ? "font-semibold" : "font-medium"} tracking-wide`}>{label}</span>
                      </div>
                      {badge}
                    </motion.div>
                    {active && mounted && (
                      <motion.div
                        layoutId="admin-sidebar-active"
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

          {/* Footer User Profile with Logout */}
          <div className="mt-auto px-2 relative" ref={profileRef}>
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: -5, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-0 w-full mb-2 p-2 rounded-2xl bg-[#0F111A] border border-[#5227FF]/20 shadow-2xl z-[60] backdrop-blur-xl"
                >
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all font-bold text-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center justify-between group cursor-pointer rounded-[1.25rem] bg-white/[0.02] border border-white/[0.05] p-3 hover:bg-white/[0.04] hover:border-[#5227FF]/30 transition-all shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#12183A] to-[#0A0D20] border border-[#5227FF]/40 text-sm font-bold text-white shadow-[0_0_15px_rgba(82,39,255,0.3)] group-hover:scale-105 transition-transform">
                  {adminUser.fullName.charAt(0)}
                </div>
                <div className="flex flex-col max-w-[130px]">
                  <span className="text-[14px] font-semibold text-white/90 truncate">{adminUser.fullName}</span>
                  <span className="text-[10px] font-medium text-white/40 truncate">{adminUser.email}</span>
                </div>
              </div>
              <button className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${isProfileOpen ? 'bg-[#5227FF] rotate-180' : 'bg-white/5 group-hover:bg-white/10'}`}>
                <MoreHorizontal className={`h-4 w-4 transition-colors ${isProfileOpen ? 'text-white' : 'text-white/50'}`} />
              </button>
            </div>
          </div>
        </motion.aside>

        {/* MAIN CONTENT AREA */}
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
              <span className="text-xs font-semibold text-white">Dashboard</span>
              <ChevronRight className="h-3 w-3 text-white/30" />
              <span className="text-xs font-semibold text-[#5227FF]">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
            </div>

            <div className="flex flex-1 justify-end items-center gap-4 lg:gap-6">
              <div className="relative hidden w-full max-w-md lg:block group">
                <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/30 group-focus-within:text-[#5227FF] transition-colors" />
                <input
                  type="search"
                  placeholder="Search users, clubs..."
                  className="w-full rounded-full border border-white/[0.08] bg-black/30 py-3 pl-12 pr-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#5227FF]/60 focus:bg-white/[0.04] transition-all shadow-inner"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const q = (e.target as HTMLInputElement).value.trim();
                      router.push(q ? `${staffHref("/users")}?q=${encodeURIComponent(q)}` : staffHref("/users"));
                    }
                  }}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/[0.03] border border-white/[0.08] p-1.5 hover:bg-white/[0.06] transition-colors cursor-pointer backdrop-blur-md">
                   <NotificationBell
                    userId={adminUser.id}
                    initialNotifications={adminUser.notifications.map((n) => ({
                      ...n,
                      createdAt: n.createdAt.toISOString(),
                    }))}
                  />
                </div>
                <div 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer hover:border-[#5227FF]/50 transition-all md:hidden"
                >
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120" alt="Admin" className="h-full w-full object-cover" />
                </div>
                <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] hidden md:block">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160" alt="Admin" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </motion.header>

          <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 scrollbar-hide relative z-10 w-full max-w-[1400px] mx-auto pb-32 md:pb-8">
            {children}
          </main>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION - PREMIUM ADMIN FIT */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#070914]/90 backdrop-blur-2xl border-t border-[#5227FF]/20 z-[100] md:hidden flex items-center justify-around px-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {navWithHref.slice(0, 4).map((item) => {
          const isActive = pathname === item.href || (item.href !== STAFF_PUBLIC_PREFIX && pathname.startsWith(item.href + "/"));
          const Icon = item.icon;
          const badge = item.badgeKey === "pending" && pendingCount > 0 ? (
            <div className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#00E87A] px-1 text-[9px] font-bold text-[#070914] shadow-[0_0_10px_rgba(0,232,122,0.6)]">
              {pendingCount}
            </div>
          ) : null;

          return (
            <Link 
              key={item.label}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-16 h-full group"
            >
              <div className="relative">
                <Icon 
                  className={`h-6 w-6 transition-all duration-300 ${isActive ? "text-[#5227FF] scale-110" : "text-white/40"}`} 
                  strokeWidth={isActive ? 3 : 2.5}
                />
                {badge}
                {isActive && (
                  <motion.div 
                    layoutId="admin-mobile-nav-glow"
                    className="absolute -inset-4 bg-[#5227FF]/10 blur-xl rounded-full -z-10"
                  />
                )}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-[0.05em] mt-1.5 transition-colors ${isActive ? "text-[#5227FF]" : "text-white/20"}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="admin-mobile-nav-indicator"
                  className="absolute top-0 w-8 h-1 bg-[#5227FF] rounded-b-full shadow-[0_0_15px_rgba(82,39,255,0.8)]"
                />
              )}
            </Link>
          );
        })}
        {/* Sign Out for mobile */}
        <button 
          onClick={logout}
          className="flex flex-col items-center justify-center w-16 h-full text-white/40 group"
        >
          <LogOut className="h-6 w-6 transition-colors group-hover:text-red-400" strokeWidth={2.5} />
          <span className="text-[9px] font-bold uppercase tracking-[0.05em] mt-1.5 group-hover:text-red-400/60">Logout</span>
        </button>
      </nav>
    </div>
  );
}
