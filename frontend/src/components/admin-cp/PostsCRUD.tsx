"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, Pin, Trash2, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Post = {
  id: string; caption: string | null; content: string | null; imageUrl: string | null;
  hidden: boolean; pinned: boolean; likesCount: number; createdAt: string;
  club: { id: string; name: string }; user: { id: string; fullName: string };
};

export function PostsCRUD({ posts: initial, clubs }: { posts: Post[]; clubs: { id: string; name: string }[] }) {
  const [posts, setPosts] = useState(initial);
  const [q, setQ] = useState("");
  const [clubF, setClubF] = useState("");
  const [hiddenF, setHiddenF] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (q && !`${p.caption || ""} ${p.content || ""} ${p.user.fullName}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (clubF && p.club.id !== clubF) return false;
      if (hiddenF === "hidden" && !p.hidden) return false;
      if (hiddenF === "visible" && p.hidden) return false;
      return true;
    });
  }, [posts, q, clubF, hiddenF]);

  const patchPost = async (id: string, body: Record<string, any>) => {
    try {
      const res = await fetch(`/api/admin-cp/posts/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { toast.error("Failed"); return false; }
      return true;
    } catch { toast.error("Error"); return false; }
  };

  const toggleHide = async (p: Post) => {
    if (await patchPost(p.id, { hidden: !p.hidden })) {
      setPosts((prev) => prev.map((x) => x.id === p.id ? { ...x, hidden: !x.hidden } : x));
      toast.success(p.hidden ? "Post visible" : "Post hidden");
    }
  };

  const togglePin = async (p: Post) => {
    if (await patchPost(p.id, { pinned: !p.pinned })) {
      setPosts((prev) => prev.map((x) => x.id === p.id ? { ...x, pinned: !x.pinned } : x));
      toast.success(p.pinned ? "Unpinned" : "Pinned");
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    try {
      await fetch(`/api/admin-cp/posts/${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((x) => x.id !== id));
      toast.success("Post deleted");
    } catch { toast.error("Failed"); }
  };

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} posts?`)) return;
    for (const id of selected) {
      await fetch(`/api/admin-cp/posts/${id}`, { method: "DELETE" }).catch(() => {});
    }
    setPosts((prev) => prev.filter((x) => !selected.has(x.id)));
    setSelected(new Set());
    toast.success("Bulk delete done");
  };

  const selectAll = filtered.length > 0 && filtered.every((p) => selected.has(p.id));
  const toggleSelectAll = () => {
    if (selectAll) setSelected(new Set());
    else setSelected(new Set(filtered.map((p) => p.id)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5227FF]">Moderation</p>
          <h1 className="mt-1 text-2xl font-bold text-white">Posts ({posts.length})</h1>
        </div>
        {selected.size > 0 && (
          <button onClick={bulkDelete} className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-sm font-bold text-red-300">
            Delete {selected.size} selected
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search posts..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-[#5227FF]/50"
          />
        </div>
        <select value={clubF} onChange={(e) => setClubF(e.target.value)} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none">
          <option value="">All clubs</option>
          {clubs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={hiddenF} onChange={(e) => setHiddenF(e.target.value)} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none">
          <option value="">All</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3 px-4 text-[10px] text-white/30">
          <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className="accent-[#5227FF]" />
          <span>Select all</span>
        </div>
        {filtered.map((p) => (
          <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={`flex items-center gap-4 rounded-xl border p-4 ${p.hidden ? "border-white/[0.04] bg-white/[0.01] opacity-50" : "border-white/[0.06] bg-white/[0.02]"}`}
          >
            <input type="checkbox" checked={selected.has(p.id)} onChange={() => { const s = new Set(selected); s.has(p.id) ? s.delete(p.id) : s.add(p.id); setSelected(s); }} className="accent-[#5227FF]" />
            {p.imageUrl && <img src={p.imageUrl} alt="" className="h-12 w-12 rounded-lg object-cover flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-white truncate">{p.caption || p.content || "(no text)"}</p>
              <p className="text-[10px] text-white/30 mt-0.5">{p.user.fullName} · {p.club.name} · {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {p.pinned && <span className="text-[9px] font-bold text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded-full">📌</span>}
              <span className="text-xs text-white/30 tabular-nums">❤️ {p.likesCount}</span>
              <button onClick={() => toggleHide(p)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-all" title={p.hidden ? "Show" : "Hide"}>
                {p.hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              </button>
              <button onClick={() => togglePin(p)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-amber-300 transition-all" title={p.pinned ? "Unpin" : "Pin"}>
                <Pin className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => deletePost(p.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
