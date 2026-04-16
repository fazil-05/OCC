"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Grid3X3, CheckCircle2, Image as ImageIcon, TrendingUp, Sparkles, ChevronRight, Activity, ArrowRight, MoreHorizontal } from "lucide-react";
import { staffHref } from "@/lib/staff-paths";

export function AdminOverviewClient({ 
  totalUsers, activeClubs, pendingApprovals, totalPosts 
}: { 
  totalUsers: number;
  activeClubs: number;
  pendingApprovals: number;
  totalPosts: number;
}) {
  const stats = [
    { label: "Total users", value: totalUsers, href: staffHref("/users"), icon: Users },
    { label: "Active clubs", value: activeClubs, href: staffHref("/clubs"), icon: Grid3X3 },
    {
      label: "Pending approvals",
      value: pendingApprovals,
      href: staffHref("/approvals"),
      icon: CheckCircle2,
      highlight: pendingApprovals > 0,
    },
    { label: "Public posts", value: totalPosts, href: staffHref("/posts"), icon: ImageIcon },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#12183A]/80 to-[#0A0D20] p-10 lg:p-14 border border-white/[0.04] shadow-2xl backdrop-blur-3xl"
      >
        <div className="absolute top-[-20%] right-[-10%] h-[300px] w-[300px] rounded-full bg-[#5227FF]/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[200px] w-[200px] rounded-full bg-[#D4AF37]/20 blur-[100px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 mb-6"
            >
              <Sparkles className="h-4 w-4 text-[#5227FF]" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                Command Center
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4"
            >
              Make Things <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#5227FF] to-[#8C6DFD]">Simple !</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-white/60 font-medium max-w-xl leading-relaxed"
            >
              Management and planning in a simple and attractive style will bring you success. Track platform health, club leaders, and content at a glance.
            </motion.p>
          </div>

          {/* Quick Actions / Floating elements */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-4 min-w-[240px]"
          >
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#00E87A] shadow-[0_0_10px_rgba(0,232,122,0.8)]" />
                <span className="text-sm font-semibold text-white/90">System Status</span>
              </div>
              <span className="text-xs font-mono px-2 py-1 bg-white/10 rounded-lg text-white/80">Optimal</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Grid area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Left Stats Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
        >
          {stats.map((stat, idx) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <Link
                href={stat.href}
                className={`group block relative overflow-hidden rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-1 ${
                  stat.highlight 
                    ? "bg-gradient-to-br from-[#5227FF]/20 via-[#111122]/80 to-[#111122] border border-[#5227FF]/40 shadow-[0_20px_60px_-15px_rgba(82,39,255,0.4)]"
                    : "bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] shadow-2xl hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]"
                }`}
              >
                {/* Glowing orb behind icon */}
                <div className={`absolute top-0 right-0 h-32 w-32 rounded-full opacity-20 blur-[60px] pointer-events-none transition-opacity duration-500 ${
                  stat.highlight ? "bg-[#5227FF] opacity-40 group-hover:opacity-60" : "bg-white group-hover:bg-[#5227FF]"
                }`} />

                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className={`p-4 rounded-2xl ${
                    stat.highlight ? "bg-[#5227FF]" : "bg-white/5 group-hover:bg-white/10"
                  } transition-colors duration-300`}>
                    <stat.icon className={`h-6 w-6 ${stat.highlight ? "text-white" : "text-white/80 group-hover:text-white"}`} />
                  </div>
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/[0.05] group-hover:bg-white/[0.08] transition-colors">
                    <ArrowRight className={`h-4 w-4 ${stat.highlight ? "text-[#5227FF]" : "text-white/30 group-hover:text-white/80"}`} />
                  </div>
                </div>

                <div className="relative z-10">
                  <p className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-2">{stat.label}</p>
                  <p className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 tabular-nums">{stat.value}</p>
                  
                  {/* Progress bar visualizer for style */}
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.max(20, stat.value * 2))}%` }}
                      transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                      className={`h-full rounded-full ${stat.highlight ? "bg-gradient-to-r from-[#5227FF] to-[#8C6DFD]" : "bg-white/30"}`}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Right Sidebar Section (Activity / Reports) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col gap-6"
        >
          {/* Quick Note / Highlight */}
          <div className="rounded-[2rem] bg-gradient-to-b from-[#1E2659] to-[#0D1024] border border-[#5227FF]/20 p-7 relative overflow-hidden shadow-[0_20px_40px_-15px_rgba(82,39,255,0.2)]">
            <div className="absolute top-0 bg-[#5227FF] h-[100px] w-[100px] blur-[80px] rounded-full left-1/2 -translate-x-1/2 opacity-30 pointer-events-none" />
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-white font-semibold text-lg tracking-tight">Today Note</h3>
              <button className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <ChevronRight className="h-4 w-4 text-white p-0.5" />
              </button>
            </div>
            <div className="relative z-10 pl-4 border-l-2 border-[#5227FF]/50 mb-6 py-1">
              <p className="text-sm text-white/70 leading-relaxed font-medium">
                Review <span className="text-white font-semibold">{stats.find(s => s.label === "Pending approvals")?.value || 0}</span> club proposals and manage platform operations for the week ahead 🚀
              </p>
            </div>
            <div className="flex justify-between items-center relative z-10 pt-4 border-t border-white/[0.05]">
              <span className="text-xs font-semibold text-[#5227FF]">● Online</span>
              <button className="text-xs bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-xl transition-all">
                Review Now
              </button>
            </div>
          </div>

          {/* Activity Mini Chart */}
          <div className="rounded-[2rem] bg-[#0A0D20] border border-white/[0.05] p-7 shadow-2xl relative overflow-hidden">
             <div className="flex justify-between items-center mb-8 relative z-10">
              <h3 className="text-white font-semibold text-lg tracking-tight">Activity</h3>
              <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#5227FF] to-[#2B4BFF] shadow-[0_0_15px_rgba(82,39,255,0.3)]">
                <span className="text-xs font-semibold text-white cursor-pointer group-hover:scale-105 transition-transform flex items-center gap-1">
                  Get Report <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
            
            <div className="relative h-32 flex items-end justify-between gap-1 z-10 px-2">
              {/* Very simple abstract chart for aesthetics */}
              {[30, 50, 40, 70, 85, 45, 60, 90, 65, 80].map((val, i) => (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ duration: 1, delay: 0.6 + (i * 0.05) }}
                  key={i}
                  className="w-full flex justify-center relative group"
                >
                  <div className={`w-1.5 rounded-t-full rounded-b-sm transition-all duration-300 group-hover:bg-[#5227FF] group-hover:h-full ${i === 7 ? "bg-[#5227FF] shadow-[0_0_10px_#5227FF]" : "bg-white/[0.08]"}`} />
                  {i === 7 && (
                    <div className="absolute -top-7 px-2 py-0.5 bg-[#5227FF] text-white text-[9px] font-bold rounded shadow-[0_0_10px_#5227FF]">
                      80%
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-white/30 uppercase">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span className="text-white/80">Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
