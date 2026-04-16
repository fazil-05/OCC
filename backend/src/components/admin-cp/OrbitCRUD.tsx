"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Eye, EyeOff, Upload, Loader2 } from "lucide-react";

type OrbitProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
};

type FormData = {
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  active: boolean;
};

const CATEGORIES = [
  "Clubs", "Events", "Campus Life", "Gigs", "Music",
  "Fashion", "Sports", "Tech", "Photography", "Bikers",
  "Education", "Wellness", "Art", "Food", "Gaming",
];

export function OrbitCRUD({ projects: initial }: { projects: OrbitProject[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [projects, setProjects] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const empty: FormData = {
    title: "",
    category: CATEGORIES[0],
    description: "",
    imageUrl: "",
    sortOrder: projects.length,
    active: true,
  };
  const [form, setForm] = useState<FormData>(empty);

  const openCreate = () => {
    setForm({ ...empty, sortOrder: projects.length });
    setEditId(null);
    setPreviewUrl("");
    setShowModal(true);
  };

  const openEdit = (p: OrbitProject) => {
    setForm({
      title: p.title,
      category: p.category,
      description: p.description,
      imageUrl: p.imageUrl,
      sortOrder: p.sortOrder,
      active: p.active,
    });
    setEditId(p.id);
    setPreviewUrl(p.imageUrl);
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("purpose", "orbit");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setForm((prev) => ({ ...prev, imageUrl: data.url }));
      setPreviewUrl(data.url);
      toast.success("Image uploaded to Cloudinary");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const save = async () => {
    if (!form.title || !form.imageUrl) {
      toast.error("Title and Image URL are required");
      return;
    }
    setLoading(true);
    try {
      const url = editId ? `/api/admin-cp/orbit/${editId}` : "/api/admin-cp/orbit";
      const res = await fetch(url, {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save");
        return;
      }
      toast.success(editId ? "Project updated" : "Project added to Orbit");
      setShowModal(false);
      router.refresh();
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Remove this project from the Orbit?")) return;
    await fetch(`/api/admin-cp/orbit/${id}`, { method: "DELETE" });
    setProjects((p) => p.filter((x) => x.id !== id));
    toast.success("Removed from Orbit");
  };

  const toggleActive = async (p: OrbitProject) => {
    await fetch(`/api/admin-cp/orbit/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !p.active }),
    });
    setProjects((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, active: !x.active } : x))
    );
    toast.success(p.active ? "Hidden from Orbit" : "Shown on Orbit");
  };

  const activeCount = projects.filter((p) => p.active).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5227FF]">
            Orbit Gallery
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white">
            Orbit Projects ({projects.length})
          </h1>
          <p className="text-xs text-white/40 mt-1">
            {activeCount} active · {projects.length - activeCount} hidden
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5227FF] to-[#8C6DFD] text-sm font-bold text-white hover:shadow-xl hover:shadow-[#5227FF]/20 transition-all"
        >
          <Plus className="h-4 w-4" /> Add to Orbit
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
        {projects.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`group relative rounded-xl border overflow-hidden transition-all ${
              p.active
                ? "border-white/[0.08] bg-white/[0.02] hover:border-[#5227FF]/30"
                : "border-white/[0.04] bg-white/[0.01] opacity-50"
            }`}
          >
            <div className="aspect-[4/3] relative overflow-hidden bg-white/[0.03]">
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-white/10" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => openEdit(p)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => toggleActive(p)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all"
                  title={p.active ? "Hide" : "Show"}
                >
                  {p.active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => deleteProject(p.id)}
                  className="p-2 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-white backdrop-blur-sm transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {!p.active && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-[9px] font-bold text-white/60 uppercase tracking-wider">
                  Hidden
                </div>
              )}
            </div>

            <div className="p-3">
              <h3 className="font-bold text-white text-[13px] truncate">{p.title}</h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-medium text-[#5227FF]/70 uppercase tracking-wider">
                  {p.category}
                </span>
                <span className="text-[9px] text-white/25">#{p.sortOrder}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20">
          <ImageIcon className="h-12 w-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/40 text-sm">No orbit projects yet</p>
          <p className="text-white/25 text-xs mt-1">
            Add images to populate the orbit carousel on your landing page
          </p>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#5227FF]/20 bg-[#0D0F1C] p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">
                  {editId ? "Edit Orbit Project" : "Add to Orbit"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06] group/preview">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setPreviewUrl("")}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/20 gap-2">
                       <ImageIcon className="h-10 w-10 opacity-50" />
                       <span className="text-[10px] uppercase font-bold tracking-widest">No Image Selected</span>
                    </div>
                  )}

                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-8 w-8 text-[#5227FF] animate-spin" />
                      <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Uploading to Cloudinary...</span>
                    </div>
                  )}

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 opacity-0 group-hover/preview:opacity-100 bg-black/40 flex items-center justify-center transition-opacity"
                  >
                    <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-2">
                       <Upload className="h-4 w-4" />
                       Change Image
                    </div>
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*"
                />

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">
                      Image Source
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={form.imageUrl}
                        onChange={(e) => {
                          setForm((p) => ({ ...p, imageUrl: e.target.value }));
                          setPreviewUrl(e.target.value);
                        }}
                        placeholder="Cloudinary URL or paste link"
                        className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-[#5227FF]/40 transition-colors"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
                        title="Upload from device"
                      >
                         {uploading ? <Loader2 className="h-4 w-4 animate-spin text-white/40" /> : <Upload className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">
                      Title *
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Annual Tech Fest 2025"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-[#5227FF]/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none appearance-none cursor-pointer"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-[#0D0F1C]">{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                      rows={2}
                      placeholder="Short description (optional)"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none resize-none focus:border-[#5227FF]/40 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={form.sortOrder}
                        onChange={(e) => setForm((p) => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-3 cursor-pointer py-2.5">
                        <input
                          type="checkbox"
                          checked={form.active}
                          onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                          className="w-4 h-4 rounded accent-[#5227FF]"
                        />
                        <span className="text-sm text-white/60">Active</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/[0.06]">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={loading || uploading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#5227FF] to-[#8C6DFD] text-sm font-bold text-white disabled:opacity-50"
                >
                  {loading ? "Saving..." : editId ? "Update" : "Add to Orbit"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
