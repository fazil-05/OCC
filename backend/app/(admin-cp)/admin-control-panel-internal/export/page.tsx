"use client";

import { motion } from "framer-motion";
import { Download, Users, Grid3X3, FileText, Calendar, Briefcase } from "lucide-react";
import { toast } from "sonner";

const exports = [
  { type: "users", label: "Users", desc: "All registered users with contact info, roles, and join dates", icon: Users, color: "#5227FF" },
  { type: "clubs", label: "Clubs", desc: "All clubs with member counts, headers, and activity metrics", icon: Grid3X3, color: "#00E87A" },
  { type: "posts", label: "Posts", desc: "All posts with captions, engagement metrics, and metadata", icon: FileText, color: "#8C6DFD" },
  { type: "events", label: "Events", desc: "All events with venues, dates, and registration counts", icon: Calendar, color: "#00B4D8" },
  { type: "gigs", label: "Gigs", desc: "All gigs with pay ranges and application counts", icon: Briefcase, color: "#D4AF37" },
];

export default function ExportPage() {
  const download = async (type: string) => {
    toast.info(`Generating ${type} CSV...`);
    try {
      const res = await fetch(`/api/admin-cp/export/${type}`);
      if (!res.ok) { toast.error("Export failed"); return; }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url;
      a.download = `occ-${type}-${new Date().toISOString().split("T")[0]}.csv`;
      a.click(); window.URL.revokeObjectURL(url);
      toast.success(`${type} CSV downloaded`);
    } catch { toast.error("Error"); }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5227FF]">Data</p>
        <h1 className="mt-1 text-2xl font-bold text-white flex items-center gap-3">
          <Download className="h-6 w-6 text-[#5227FF]" /> Bulk Export
        </h1>
        <p className="text-sm text-white/40 mt-1">Download platform data as CSV files</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exports.map((ex, i) => (
          <motion.button key={ex.type} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => download(ex.type)}
            className="group flex items-start gap-4 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#5227FF]/20 text-left transition-all hover:-translate-y-0.5"
          >
            <div className="p-3 rounded-xl" style={{ background: `${ex.color}15` }}>
              <ex.icon className="h-5 w-5" style={{ color: ex.color }} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-[15px]">{ex.label}</p>
              <p className="text-xs text-white/35 mt-1 leading-relaxed">{ex.desc}</p>
            </div>
            <Download className="h-4 w-4 text-white/20 group-hover:text-[#5227FF] transition-colors mt-1" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
