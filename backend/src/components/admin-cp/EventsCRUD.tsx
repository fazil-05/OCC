"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Calendar, MapPin, Users, Upload, ImagePlus, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { EventRegistrantsModal } from "../common/EventRegistrantsModal";

type Event = {
  id: string; title: string; description: string; date: string; venue: string;
  price: number; maxCapacity: number | null; imageUrl: string; createdAt: string;
  club: { id: string; name: string }; _count: { registrations: number };
};

type FormData = { clubId: string; title: string; description: string; date: string; venue: string; price: number; maxCapacity: number | null; imageUrl: string };

export function EventsCRUD({ events: initial, clubs }: { events: Event[]; clubs: { id: string; name: string }[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [events, setEvents] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setEvents(initial);
  }, [initial]);

  
  // Registrants State
  const [showRegistrants, setShowRegistrants] = useState(false);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);

  const empty: FormData = { clubId: clubs[0]?.id || "", title: "", description: "", date: "", venue: "", price: 0, maxCapacity: null, imageUrl: "" };
  const [form, setForm] = useState<FormData>(empty);

  const openCreate = () => { setForm(empty); setEditId(null); setShowModal(true); };
  const openEdit = (e: Event) => { setForm({ clubId: e.club.id, title: e.title, description: e.description, date: e.date.split("T")[0], venue: e.venue, price: e.price, maxCapacity: e.maxCapacity, imageUrl: e.imageUrl }); setEditId(e.id); setShowModal(true); };

  const openRegistrants = (e: Event) => {
    setActiveEvent(e);
    setShowRegistrants(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("purpose", "events");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setForm((p) => ({ ...p, imageUrl: data.url }));
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.title || !form.description || !form.date || !form.venue) {
      toast.error("Please fill in all required fields");
      return;
    }
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
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5227FF] to-[#8C6DFD] text-sm font-bold text-white shadow-[0_10px_20px_rgba(82,39,255,0.2)] hover:shadow-[0_15px_25px_rgba(82,39,255,0.3)] transition-all">
          <Plus className="h-4 w-4" /> Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((e) => (
          <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="group overflow-hidden rounded-[2rem] border border-white/[0.06] bg-white/[0.02] hover:border-[#5227FF]/20 transition-all flex flex-col h-full"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
              {e.imageUrl ? (
                <img src={e.imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#5227FF]/10 to-transparent">
                  <Calendar className="h-8 w-8 text-white/10" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute top-4 left-4 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white">
                <Calendar className="h-3 w-3 text-[#5227FF]" /> {format(new Date(e.date), "dd MMM yyyy")}
              </div>

              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(e)} className="h-8 w-8 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-[#5227FF] transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => deleteEvent(e.id)} className="h-8 w-8 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-red-500 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#8C6DFD] mb-1">{e.club.name}</p>
                <h3 className="font-bold text-white text-[17px] leading-tight line-clamp-1">{e.title}</h3>
              </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <p className="text-[13px] text-white/50 line-clamp-2 mb-4 leading-relaxed">{e.description}</p>
              
              <div className="mt-8 grid grid-cols-2 gap-3">
                 <button onClick={() => openRegistrants(e)} className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-[11px] font-bold text-white hover:bg-white/[0.1] transition-all">
                   <Users className="h-3.5 w-3.5 text-[#5227FF]" />
                   {e._count.registrations} Registrants
                 </button>
                 <div className="flex items-center justify-center px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[11px] font-bold text-white/40">
                   {e.price > 0 ? `₹${e.price}` : "Free Entry"}
                 </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-white/30 border-t border-white/[0.06] pt-4">
                 <MapPin className="h-3 w-3" /> {e.venue}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/[0.08] bg-[#0D0F1C] shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-[#0D0F1C]/90 backdrop-blur-md border-b border-white/[0.06]">
                <div>
                  <h2 className="text-xl font-bold text-white">{editId ? "Edit Event" : "Create Event"}</h2>
                  <p className="text-xs text-white/40 mt-0.5">Define your signature club experience.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/5 text-white/40 transition-colors"><X className="h-5 w-5" /></button>
              </div>

              <div className="p-8 space-y-6">
                {/* Image Upload Section */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5227FF] block mb-3">Event Visual</label>
                  <div className="space-y-4">
                    {form.imageUrl ? (
                      <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden border border-white/10 group">
                        <img src={form.imageUrl} className="h-full w-full object-cover" alt="Event" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                           <button onClick={() => fileInputRef.current?.click()} className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-110 transition-transform">
                             <Upload className="h-4 w-4" />
                           </button>
                           <button onClick={() => setForm(p => ({ ...p, imageUrl: "" }))} className="h-10 w-10 flex items-center justify-center rounded-full bg-red-500 text-white hover:scale-110 transition-transform">
                             <Trash2 className="h-4 w-4" />
                           </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full aspect-[21/9] rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-3 hover:bg-white/[0.04] hover:border-[#5227FF]/30 transition-all"
                      >
                        {uploading ? (
                          <Loader2 className="h-8 w-8 text-[#5227FF] animate-spin" />
                        ) : (
                          <>
                            <div className="h-12 w-12 rounded-full bg-[#5227FF]/10 flex items-center justify-center">
                              <Upload className="h-5 w-5 text-[#5227FF]" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-bold text-white">Upload Banner</p>
                              <p className="text-[10px] text-white/30 mt-1">Recommended: 1200x600px (Max 8MB)</p>
                            </div>
                          </>
                        )}
                      </button>
                    )}

                    <div className="relative">
                      <ImagePlus className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                      <input 
                        value={form.imageUrl} 
                        onChange={(e) => setForm(p => ({ ...p, imageUrl: e.target.value }))}
                        placeholder="Or paste image URL directly..."
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-[#5227FF]/40 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1.5">Hosted By *</label>
                      <select value={form.clubId} onChange={(e) => setForm((p) => ({ ...p, clubId: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-[#5227FF]/40 transition-colors">
                        {clubs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1.5">Location *</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                        <input value={form.venue} onChange={(e) => setForm((p) => ({ ...p, venue: e.target.value }))} placeholder="Main Campus Auditorium" className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-[#5227FF]/40 transition-colors" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1.5">Date *</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                        <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-[#5227FF]/40 transition-colors [color-scheme:dark]" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1.5">Price (₹)</label>
                        <input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: parseInt(e.target.value) || 0 }))} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-[#5227FF]/40 transition-colors" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1.5">Capacity</label>
                        <input type="number" value={form.maxCapacity || ""} onChange={(e) => setForm((p) => ({ ...p, maxCapacity: parseInt(e.target.value) || null }))} placeholder="Unlimited" className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-[#5227FF]/40 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1.5">Event Title *</label>
                  <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="The Grand Annual Gala 2026" className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-bold text-white outline-none focus:border-[#5227FF]/40 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1.5">Description *</label>
                  <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={4} placeholder="Describe the vibe, the program, and why people should join..." className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none focus:border-[#5227FF]/40 transition-colors resize-none leading-relaxed" />
                </div>
              </div>

              <div className="sticky bottom-0 z-10 flex justify-end gap-3 p-8 bg-[#0D0F1C]/90 backdrop-blur-md border-t border-white/[0.06]">
                <button onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-white/50 hover:text-white transition-colors">Cancel</button>
                <button onClick={save} disabled={loading || uploading} className="px-10 py-3 rounded-xl bg-gradient-to-r from-[#5227FF] to-[#8C6DFD] text-sm font-bold text-white shadow-[0_10px_20px_rgba(82,39,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100">
                  {loading ? "Processing..." : editId ? "Update Event" : "Create Event"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <EventRegistrantsModal 
        isOpen={showRegistrants}
        onClose={() => setShowRegistrants(false)}
        event={activeEvent}
      />

      <input 
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
}
