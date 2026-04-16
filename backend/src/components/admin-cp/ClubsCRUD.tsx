"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Users, FileText, Calendar, Briefcase, Snowflake, X, Upload, Grid3X3 } from "lucide-react";

type Club = {
  id: string; name: string; slug: string; icon: string; description: string;
  theme: string; coverImage: string | null; postingFrozen: boolean;
  memberCount: number; createdAt: string;
  header: { id: string; fullName: string; email: string } | null;
  _count: { members: number; posts: number; events: number; gigs: number };
};

type Header = { id: string; fullName: string; email: string };

type FormData = {
  name: string; slug: string; description: string; icon: string; theme: string;
  coverImage: string; headerId: string;
};

export function ClubsCRUD({ clubs: initial, headers }: { clubs: Club[]; headers: Header[] }) {
  const router = useRouter();
  const [clubs, setClubs] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormData>({ name: "", slug: "", description: "", icon: "🎯", theme: "purple", coverImage: "", headerId: "" });

  const openCreate = () => { setForm({ name: "", slug: "", description: "", icon: "🎯", theme: "purple", coverImage: "", headerId: "" }); setEditId(null); setShowModal(true); };
  const openEdit = (c: Club) => {
    setForm({ name: c.name, slug: c.slug, description: c.description, icon: c.icon, theme: c.theme, coverImage: c.coverImage || "", headerId: c.header?.id || "" });
    setEditId(c.id); setShowModal(true);
  };

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const uploadImage = async (file: File) => {
    setUploading(true);
    const fd = new FormData(); fd.append("file", file); fd.append("purpose", "clubs");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const { url, error } = await res.json();
      if (error) { toast.error(error); return; }
      setForm((p) => ({ ...p, coverImage: url }));
      toast.success("Image uploaded");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const save = async () => {
    if (!form.name || !form.slug || !form.description) { toast.error("Fill required fields"); return; }
    setLoading(true);
    try {
      const url = editId ? `/api/admin-cp/clubs/${editId}` : "/api/admin-cp/clubs";
      const method = editId ? "PATCH" : "POST";
      const payload: any = { ...form };
      if (!payload.headerId) payload.headerId = undefined;
      if (!payload.coverImage) payload.coverImage = undefined;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed"); return; }
      toast.success(editId ? "Club updated" : "Club created");
      setShowModal(false);
      router.refresh();
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  const deleteClub = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" and ALL its posts, events, gigs, members? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin-cp/clubs/${id}`, { method: "DELETE" });
      if (!res.ok) { toast.error("Failed to delete"); return; }
      setClubs((p) => p.filter((c) => c.id !== id));
      toast.success("Club deleted");
    } catch { toast.error("Network error"); }
  };

  const freezeToggle = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/admin-cp/clubs/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ postingFrozen: !current }) });
      setClubs((p) => p.map((c) => c.id === id ? { ...c, postingFrozen: !current } : c));
      toast.success(current ? "Posting unfrozen" : "Posting frozen");
    } catch { toast.error("Failed"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5227FF]">Management</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">Clubs</h1>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5227FF] to-[#8C6DFD] text-sm font-bold text-white hover:shadow-[0_0_20px_rgba(82,39,255,0.4)] transition-all">
          <Plus className="h-4 w-4" /> Create Club
        </button>
      </div>

      {/* Club Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clubs.map((club, i) => (
          <motion.div key={club.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#5227FF]/30 transition-all"
          >
            {/* Cover */}
            <div className="relative h-28 bg-gradient-to-br from-[#1a1a3e] to-[#0a0d20] overflow-hidden">
              {club.coverImage && <img src={club.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070914] to-transparent" />
              <div className="absolute top-3 right-3 flex gap-1.5">
                <button onClick={() => openEdit(club)} className="p-1.5 rounded-lg bg-black/40 backdrop-blur text-white/70 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => deleteClub(club.id, club.name)} className="p-1.5 rounded-lg bg-black/40 backdrop-blur text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              {club.postingFrozen && (
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20 backdrop-blur text-[9px] font-bold text-blue-300">
                  <Snowflake className="h-3 w-3" /> Frozen
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{club.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-[15px] truncate">{club.name}</h3>
                  <p className="text-[11px] text-white/35 font-mono">/{club.slug}</p>
                </div>
              </div>
              <p className="text-xs text-white/45 line-clamp-2 mb-4 leading-relaxed">{club.description}</p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { icon: Users, val: club._count.members, label: "Members" },
                  { icon: FileText, val: club._count.posts, label: "Posts" },
                  { icon: Calendar, val: club._count.events, label: "Events" },
                  { icon: Briefcase, val: club._count.gigs, label: "Gigs" },
                ].map(({ icon: I, val, label }) => (
                  <div key={label} className="text-center p-2 rounded-lg bg-white/[0.03]">
                    <p className="text-sm font-bold text-white tabular-nums">{val}</p>
                    <p className="text-[8px] text-white/30 uppercase">{label}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                <div className="text-xs text-white/40">
                  {club.header ? <span>👤 {club.header.fullName}</span> : <span className="text-white/20">No header</span>}
                </div>
                <button onClick={() => freezeToggle(club.id, club.postingFrozen)} className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${club.postingFrozen ? "bg-blue-500/15 text-blue-300" : "bg-white/5 text-white/40 hover:text-white/70"} transition-colors`}>
                  {club.postingFrozen ? "Unfreeze" : "Freeze"}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#5227FF]/20 bg-[#0D0F1C] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">{editId ? "Edit Club" : "Create Club"}</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50"><X className="h-4 w-4" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 block">Name *</label>
                  <input value={form.name} onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value, slug: editId ? p.slug : autoSlug(e.target.value) })); }}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-[#5227FF]/50" placeholder="e.g. Photography Club"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 block">Slug *</label>
                  <input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-[#5227FF]/50" placeholder="photography-club"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 block">Description *</label>
                  <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-[#5227FF]/50 resize-none" placeholder="What's this club about?"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 block">Icon (emoji)</label>
                    <input value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-2xl outline-none text-center" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 block">Theme</label>
                    <select value={form.theme} onChange={(e) => setForm((p) => ({ ...p, theme: e.target.value }))}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none"
                    >
                      {["purple", "blue", "green", "red", "yellow", "pink", "indigo", "teal"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 block">Banner Image</label>
                  <div className="flex items-center gap-3">
                    {form.coverImage ? (
                      <div className="relative h-20 w-32 rounded-lg overflow-hidden">
                        <img src={form.coverImage} alt="" className="h-full w-full object-cover" />
                        <button onClick={() => setForm((p) => ({ ...p, coverImage: "" }))} className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white"><X className="h-3 w-3" /></button>
                      </div>
                    ) : (
                      <button onClick={() => fileRef.current?.click()} disabled={uploading}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/15 text-xs text-white/50 hover:border-[#5227FF]/40 hover:text-white/70 transition-all w-full justify-center"
                      >
                        <Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload banner image"}
                      </button>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) uploadImage(e.target.files[0]); }} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 block">Assign Header</label>
                  <select value={form.headerId} onChange={(e) => setForm((p) => ({ ...p, headerId: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none"
                  >
                    <option value="">None</option>
                    {headers.map((h) => <option key={h.id} value={h.id}>{h.fullName} ({h.email})</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/[0.06]">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={save} disabled={loading} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#5227FF] to-[#8C6DFD] text-sm font-bold text-white hover:shadow-[0_0_20px_rgba(82,39,255,0.4)] disabled:opacity-50 transition-all">
                  {loading ? "Saving..." : editId ? "Save Changes" : "Create Club"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
