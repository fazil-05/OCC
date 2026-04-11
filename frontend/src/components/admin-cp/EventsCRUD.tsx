"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";

type Event = {
  id: string; title: string; description: string; date: string; venue: string;
  price: number; maxCapacity: number | null; imageUrl: string; createdAt: string;
  club: { id: string; name: string }; _count: { registrations: number };
};

type FormData = { clubId: string; title: string; description: string; date: string; venue: string; price: number; maxCapacity: number | null; imageUrl: string };

export function EventsCRUD({ events: initial, clubs }: { events: Event[]; clubs: { id: string; name: string }[] }) {
  const router = useRouter();
  const [events, setEvents] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const empty: FormData = { clubId: clubs[0]?.id || "", title: "", description: "", date: "", venue: "", price: 0, maxCapacity: null, imageUrl: "" };
  const [form, setForm] = useState<FormData>(empty);

  const openCreate = () => { setForm(empty); setEditId(null); setShowModal(true); };
  const openEdit = (e: Event) => { setForm({ clubId: e.club.id, title: e.title, description: e.description, date: e.date.split("T")[0], venue: e.venue, price: e.price, maxCapacity: e.maxCapacity, imageUrl: e.imageUrl }); setEditId(e.id); setShowModal(true); };

  const save = async () => {
    setLoading(true);
    try {
      const url = editId ? `/api/admin-cp/events/${editId}` : "/api/admin-cp/events";
      const res = await fetch(url, { method: editId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed"); return; }
      toast.success(editId ? "Updated" : "Created");
      setShowModal(false);
      router.refresh();
    } catch { toast.error("Error"); } finally { setLoading(false); }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/admin-cp/events/${id}`, { method: "DELETE" });
    setEvents((p) => p.filter((e) => e.id !== id));
    toast.success("Deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5227FF]">Management</p>
          <h1 className="mt-1 text-2xl font-bold text-white">Events ({events.length})</h1>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5227FF] to-[#8C6DFD] text-sm font-bold text-white">
          <Plus className="h-4 w-4" /> Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {events.map((e) => (
          <motion.div key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-[#5227FF]/20 transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#5227FF]/10 text-[10px] font-bold text-[#5227FF]">
                <Calendar className="h-3 w-3" /> {format(new Date(e.date), "dd MMM yyyy")}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => deleteEvent(e.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400/60"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <h3 className="font-bold text-white text-[15px] mb-1">{e.title}</h3>
            <p className="text-xs text-white/40 line-clamp-2 mb-3">{e.description}</p>
            <div className="flex items-center gap-3 text-[11px] text-white/35">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.venue}</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {e._count.registrations} regs</span>
              {e.price > 0 && <span>₹{e.price}</span>}
            </div>
            <p className="mt-2 text-[10px] text-[#5227FF]/60">{e.club.name}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#5227FF]/20 bg-[#0D0F1C] p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">{editId ? "Edit Event" : "Create Event"}</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50"><X className="h-4 w-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Club *</label>
                  <select value={form.clubId} onChange={(e) => setForm((p) => ({ ...p, clubId: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none">
                    {clubs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Title *</label>
                  <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Description *</label>
                  <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Date *</label>
                    <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Venue *</label>
                    <input value={form.venue} onChange={(e) => setForm((p) => ({ ...p, venue: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Price (₹)</label>
                    <input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: parseInt(e.target.value) || 0 }))} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Max Capacity</label>
                    <input type="number" value={form.maxCapacity || ""} onChange={(e) => setForm((p) => ({ ...p, maxCapacity: parseInt(e.target.value) || null }))} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/[0.06]">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white">Cancel</button>
                <button onClick={save} disabled={loading} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#5227FF] to-[#8C6DFD] text-sm font-bold text-white disabled:opacity-50">
                  {loading ? "Saving..." : editId ? "Update" : "Create"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
