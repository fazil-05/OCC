"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ScrollText, Filter } from "lucide-react";

type AuditEntry = { id: string; adminEmail: string; action: string; entity: string; entityId: string | null; details: any; createdAt: string };

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entityF, setEntityF] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString() });
      if (entityF) params.set("entity", entityF);
      const res = await fetch(`/api/admin-cp/audit?${params}`);
      const data = await res.json();
      setLogs(data.logs); setTotalPages(data.totalPages);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, [page, entityF]);

  const getActionColor = (action: string) => {
    if (action.startsWith("CREATE")) return "text-[#00E87A] bg-[#00E87A]/10";
    if (action.startsWith("DELETE")) return "text-red-400 bg-red-500/10";
    if (action.startsWith("UPDATE") || action.startsWith("CHANGE")) return "text-blue-400 bg-blue-500/10";
    if (action.includes("SUSPEND")) return "text-amber-400 bg-amber-500/10";
    return "text-white/50 bg-white/5";
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5227FF]">Tracking</p>
        <h1 className="mt-1 text-2xl font-bold text-white flex items-center gap-3">
          <ScrollText className="h-6 w-6 text-[#5227FF]" /> Audit Log
        </h1>
        <p className="text-sm text-white/40 mt-1">Every admin action is tracked here</p>
      </div>

      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-white/30" />
        <select value={entityF} onChange={(e) => { setEntityF(e.target.value); setPage(1); }}
          className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none">
          <option value="">All entities</option>
          {["club", "user", "post", "event", "gig", "settings", "security"].map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        {loading && <div className="py-12 text-center text-white/20">Loading...</div>}
        {!loading && logs.map((l) => (
          <motion.div key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-4 px-4 py-3 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02]">
            <div className="h-2 w-2 rounded-full bg-[#5227FF] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-white/70">{l.adminEmail}</span>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${getActionColor(l.action)}`}>{l.action}</span>
                <span className="text-[10px] text-white/30 font-mono">{l.entity}{l.entityId ? `:${l.entityId.slice(0, 8)}` : ""}</span>
              </div>
              {l.details && <p className="text-[10px] text-white/20 mt-0.5 truncate font-mono">{JSON.stringify(l.details).slice(0, 120)}</p>}
            </div>
            <span className="text-[10px] text-white/25 whitespace-nowrap">{formatDistanceToNow(new Date(l.createdAt), { addSuffix: true })}</span>
          </motion.div>
        ))}
        {!loading && logs.length === 0 && <div className="py-12 text-center text-white/20">No audit logs yet</div>}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white/50 disabled:opacity-30">Prev</button>
          <span className="text-xs text-white/40">Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white/50 disabled:opacity-30">Next</button>
        </div>
      )}
    </div>
  );
}
