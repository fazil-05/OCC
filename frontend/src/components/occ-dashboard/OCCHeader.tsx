"use client";

import { Bell, ChevronDown, Sparkles, LayoutGrid, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, Suspense } from "react";
import { ExploreNavSearch } from "@/components/occ-dashboard/ExploreNavSearch";
import Link from "next/link";
import { avatarSrc } from "@/lib/avatar";
import { useLogout } from "@/hooks/useLogout";

export function OCCHeader({ user }: { user: any }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const logout = useLogout();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex shrink-0 items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-xl z-40 w-full border-b border-black/5 sticky top-0"
    >
      <div className="min-w-0 flex-1 flex items-center gap-4 pr-4">
        <Suspense fallback={null}>
          <ExploreNavSearch />
        </Suspense>
      </div>

      {/* Action Items */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-3 bg-black/[0.02] p-1.5 rounded-2xl border border-black/5 mr-2">
          <button className="relative p-2.5 rounded-xl bg-white border border-black/5 text-slate-600 hover:text-[#5227FF] hover:border-[#5227FF]/20 transition-all group overflow-hidden">
            <Bell className="h-5 w-5" strokeWidth={2.5} />
            <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-[#5227FF]"></span>
          </button>
          
          <button className="p-2.5 rounded-xl hover:bg-black/5 text-slate-400 hover:text-slate-900 transition-all">
            <LayoutGrid className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="relative" ref={profileRef}>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`flex items-center gap-3 pl-4 p-1.5 pr-2 rounded-full border transition-all group shrink-0 ${isProfileOpen ? 'bg-black/5 border-black/10' : 'bg-black/[0.02] border-black/5'}`}
        >
          <div className="hidden sm:flex flex-col items-end leading-tight mr-1">
            <span className="text-[13px] font-bold tracking-tight text-slate-900">
              {user.fullName || "User"}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
              ELITE MEMBER
            </span>
          </div>
          <div className="relative">
            <div className={`h-9 w-9 overflow-hidden rounded-full ring-2 transition-all ${isProfileOpen ? 'ring-[#5227FF]/40' : 'ring-black/5 group-hover:ring-[#5227FF]/20'}`}>
              <img
                alt="Profile"
                src={avatarSrc(user.avatar)}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#00E87A] border-2 border-white shadow-sm" />
          </div>
          <ChevronDown className={`h-3.5 w-3.5 transition-all hidden sm:block ${isProfileOpen ? 'text-[#5227FF] rotate-180' : 'text-slate-300 group-hover:text-slate-500'}`} strokeWidth={3} />
        </motion.button>

        {/* PROFILE DROPDOWN */}
        <AnimatePresence>
          {isProfileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 8, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className="absolute top-full right-0 w-64 p-2 rounded-[24px] bg-white border border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-black/5 mb-1 sm:hidden">
                <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">{user.email}</p>
              </div>
              <Link
                href="/profile"
                className="flex items-center gap-3 w-full p-3.5 rounded-2xl hover:bg-slate-50 text-slate-700 transition-all font-bold text-sm group"
                onClick={() => setIsProfileOpen(false)}
              >
                <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 group-hover:bg-[#5227FF]/10 group-hover:text-[#5227FF] transition-all">
                   <User className="h-4 w-4" />
                </div>
                Manage Profile
              </Link>
              
              <button
                onClick={logout}
                className="flex items-center gap-3 w-full p-3.5 rounded-2xl hover:bg-red-50 text-red-500 transition-all font-bold text-sm group"
              >
                <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-red-50 group-hover:bg-red-100 transition-all">
                  <LogOut className="h-4 w-4" />
                </div>
                Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

