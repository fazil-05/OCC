import { requireUser } from "@/lib/auth";
import { PostComposer } from "@/components/club-header/PostComposer";
import { HeaderPostsManager } from "@/components/club-header/HeaderPostsManager";

export default async function HeaderPostPage() {
  const user = await requireUser();
  if (!user.clubManaged) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-white/40 text-lg">No club assigned yet.</p>
      </div>
    );
  }
  return (
    <div className="space-y-10">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[#8C6DFD] font-semibold mb-2">Create Content</p>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          New <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5227FF] to-[#8C6DFD]">Post</span>
        </h1>
        <p className="mt-2 text-sm text-white/50">Share updates, photos, announcements, and events with your club members.</p>
      </div>
      <PostComposer clubId={user.clubManaged.id} />
      <HeaderPostsManager />
    </div>
  );
}
