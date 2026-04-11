"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Plus, ChevronDown, Trash2, X } from "lucide-react";

type Gig = {
  id: string; title: string; description: string; payMin: number; payMax: number;
  createdAt: string; deadline: string | null;
  club: { id: string; name: string } | null;
  postedBy: { id: string; fullName: string } | null;
  applications: { id: string; status: string; message: string | null; createdAt: string; user: { id: string; fullName: string; email: string } }[];
};

export function GigsCRUD({ gigs: initial, clubs }: { gigs: Gig[]; clubs: { id: string; name: string }[] }) {
  const router = useRouter();
  const [gigs, setGigs] = useState(initial);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", payMin: 0, payMax: 0, clubId: clubs[0]?.id || "" });

  const save = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin-cp/gigs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { toast.error("Failed"); return; }
      toast.success("Gig created"); setShowModal(false); router.refresh();
    } catch { toast.error("Error"); } finally { setLoading(false); }
  };

  const deleteGig = async (id: string) => {
    if (!confirm("Delete this gig?")) return;
    await fetch(`/api/admin-cp/gigs/${id}`, { method: "DELETE" });
    setGigs((p) => p.filter((g) => g.id !== id)); toast.success("Deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5227FF]">Operations</p>
          <h1 className="mt-1 text-2xl font-bold text-white">Gigs ({gigs.length})</h1>
        </div>
        <button onClick={() => { setForm({ title: "", description: "", payMin: 0, payMax: 0, clubId: clubs[0]?.id || "" }); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5227FF] to-[#8C6DFD] text-sm font-bold text-white">
          <Plus className="h-4 w-4" /> Create Gig
        </button>
      </div>

      <div className="space-y-2">
        {gigs.map((g) => (
          <div key={g.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <button onClick={() => setOpenId(openId === g.id ? null : g.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02]">
              <div>
                <p className="font-semibold text-white text-[14px]">{g.title}</p>
                <p className="text-[11px] text-white/35 mt-0.5">{g.club?.name || "—"} · ₹{g.payMin}-{g.payMax} · {g.applications.length} apps</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); deleteGig(g.id); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                <ChevronDown className={`h-4 w-4 text-white/30 transition-transform ${openId === g.id ? "rotate-180" : ""}`} />
              </div>
            </button>
            <AnimatePresence>
              {openId === g.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/[0.04]">
                  <p className="px-5 py-3 text-xs text-white/40 leading-relaxed">{g.description}</p>
                  <div className="px-4 pb-4 space-y-1.5">
                    {g.applications.map((a) => (
                      <div key={a.id} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-black/20 border border-white/[0.04]">
                        <div>
                          <span className="text-[13px] font-medium text-white">{a.user.fullName}</span>
                          <span className="text-[10px] text-white/30 ml-2">{a.user.email}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${a.status === "APPROVED" ? "bg-[#00E87A]/15 text-[#00E87A]" : a.status === "REJECTED" ? "bg-red-500/15 text-red-300" : "bg-amber-500/15 text-amber-200"}`}>
                          {a.status}
                        </span>
                      </div>
                    ))}
                    {g.applications.length === 0 && <p className="text-xs text-white/20 text-center py-4">No applications yet</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-lg rounded-2xl border border-[#5227FF]/20 bg-[#0D0F1C] p-6">
              <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-bold text-white">Create Gig</h2><button onClick={() => setShowModal(false)} className="text-white/50"><X className="h-4 w-4" /></button></div>
              <div className="space-y-4">
                <div><label className="text-[10px] font-bold uppercase text-white/40 block mb-1">Club</label>
                  <select value={form.clubId} onChange={(e) => setForm((p) => ({ ...p, clubId: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none">
                    {clubs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select></div>
                <div><label className="text-[10px] font-bold uppercase text-white/40 block mb-1">Title</label>
                  <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none" /></div>
                <div><label className="text-[10px] font-bold uppercase text-white/40 block mb-1">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none resize-none" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[10px] font-bold uppercase text-white/40 block mb-1">Pay Min (₹)</label>
                    <input type="number" value={form.payMin} onChange={(e) => setForm((p) => ({ ...p, payMin: parseInt(e.target.value) || 0 }))} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none" /></div>
                  <div><label className="text-[10px] font-bold uppercase text-white/40 block mb-1">Pay Max (₹)</label>
                    <input type="number" value={form.payMax} onChange={(e) => setForm((p) => ({ ...p, payMax: parseInt(e.target.value) || 0 }))} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none" /></div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/[0.06]">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-white/50">Cancel</button>
                <button onClick={save} disabled={loading} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#5227FF] to-[#8C6DFD] text-sm font-bold text-white disabled:opacity-50">{loading ? "..." : "Create"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
