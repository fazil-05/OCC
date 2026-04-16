import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { avatarSrc } from "@/lib/avatar";
import { AlertOctagon, Trash2, CheckCircle2, MessageSquare, User, Calendar, Flag } from "lucide-react";
import Image from "next/image";

export default async function AdminReportsPage() {
  await requireAdmin();

  const reports = await prisma.commentReport.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      reporter: { select: { fullName: true, email: true, avatar: true } },
      comment: {
        include: {
          user: { select: { fullName: true, email: true, avatar: true } },
          post: { select: { id: true, caption: true, imageUrl: true } }
        }
      }
    }
  });

  return (
    <div className="space-y-10 pb-20">
      {/* Editorial Header */}
      <div className="relative group">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-12 bg-[#5227FF] rounded-full shadow-[0_0_15px_rgba(82,39,255,0.6)]" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#5227FF]">Moderation Intel</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none">
             COMMUNITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5227FF] to-[#D4AF37]">REPORTS</span>
          </h1>
          <p className="text-white/40 font-medium text-lg max-w-xl">
            Reviewing flagged activity within the social ecosystem. High-fidelity moderation for a premium community experience.
          </p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center rounded-[3rem] border border-white/[0.05] bg-white/[0.02] backdrop-blur-xl">
          <div className="h-20 w-20 rounded-full bg-[#00E87A]/10 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-[#00E87A]" />
          </div>
          <h3 className="text-2xl font-black text-white">System Clear</h3>
          <p className="text-white/30 font-bold uppercase tracking-widest text-xs mt-2">No active flags at this time</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.02] backdrop-blur-2xl transition-all hover:border-[#5227FF]/40 hover:bg-white/[0.04] shadow-2xl">
              {/* Status Indicator */}
              <div className="absolute top-0 left-0 w-1 h-full bg-[#FF3040] shadow-[0_0_15px_rgba(255,48,64,0.4)]" />
              
              <div className="p-6 sm:p-10 flex flex-col lg:flex-row gap-10">
                
                {/* Left: Report Intel */}
                <div className="lg:w-1/3 flex flex-col gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#FF3040]/10 flex items-center justify-center">
                        <Flag className="h-5 w-5 text-[#FF3040]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Reason for Intel</span>
                        <span className="text-lg font-black text-white">{report.reason}</span>
                      </div>
                    </div>
                    
                    <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="h-3.5 w-3.5 text-white/30" />
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Flagged On</span>
                      </div>
                      <span className="text-sm font-semibold text-white/80">
                        {new Date(report.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                        <User className="h-3 w-3" /> Reported By
                      </span>
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                        <div className="h-8 w-8 rounded-full overflow-hidden border border-white/10">
                          <img src={avatarSrc(report.reporter.avatar)} alt="Reporter" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">{report.reporter.fullName}</span>
                          <span className="text-[9px] font-medium text-white/30">{report.reporter.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Content Context */}
                <div className="flex-1 flex flex-col gap-6 lg:border-l lg:border-white/[0.05] lg:pl-10">
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare className="h-3 w-3" /> Flagged Content
                    </span>
                    <div className="p-6 rounded-[2rem] bg-white/[0.05] border border-white/[0.08] relative group/content shadow-inner">
                      <div className="flex items-start gap-4 mb-4">
                         <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-[#5227FF]/20">
                          <img src={avatarSrc(report.comment.user.avatar)} alt="Commenter" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-white tracking-tight">{report.comment.user.fullName}</span>
                          <span className="text-[10px] font-bold text-[#5227FF] uppercase tracking-widest">Comment Author</span>
                        </div>
                      </div>
                      <p className="text-lg font-medium leading-relaxed text-white/90 font-serif italic mb-4">
                        "{report.comment.content}"
                      </p>
                      <div className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">
                        Posted on {new Date(report.comment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-4 mt-auto">
                    <form action={async (formData) => {
                      "use server";
                      const id = formData.get("id") as string;
                      await prisma.comment.delete({ where: { id } });
                      revalidatePath("/(admin)/staff-panel-internal/reports", "page");
                    }}>
                      <input type="hidden" name="id" value={report.commentId} />
                      <button className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#FF3040] text-white text-[11px] font-black uppercase tracking-[0.15em] shadow-[0_10px_30px_rgba(255,48,64,0.3)] hover:scale-105 active:scale-95 transition-all group">
                        <Trash2 className="h-4 w-4 transition-transform group-hover:rotate-12" />
                        Sanitize Intel (Delete)
                      </button>
                    </form>

                    <form action={async (formData) => {
                      "use server";
                      const id = formData.get("id") as string;
                      await prisma.commentReport.delete({ where: { id } });
                      revalidatePath("/(admin)/staff-panel-internal/reports", "page");
                    }}>
                      <input type="hidden" name="id" value={report.id} />
                      <button className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.15em] hover:bg-white/10 active:scale-95 transition-all">
                        <CheckCircle2 className="h-4 w-4 text-[#00E87A]" />
                        Dismiss Flag
                      </button>
                    </form>

                    <button className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.15em] hover:bg-white/10 transition-all opacity-40 cursor-not-allowed">
                       View Origin Post
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
