import { format } from "date-fns";
import { GlassCard } from "@/components/ui/GlassCard";

export function GigCard({
  gig,
  action,
}: {
  gig: {
    id: string;
    title: string;
    description: string;
    payMin: number;
    payMax: number;
    deadline?: Date | string | null;
  };
  action?: React.ReactNode;
}) {
  const deadline = gig.deadline ? new Date(gig.deadline) : null;

  return (
    <div className="rounded-[32px] bg-white border border-black/5 p-6 lg:p-8 shadow-[0_4px_24px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] group">
      <div className="flex flex-col h-full space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <span className="inline-flex items-center gap-2 rounded-full border border-[#5227FF]/10 bg-[#5227FF]/5 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#5227FF]">
                Gig Opportunity
             </span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
               {deadline ? `Ends ${format(deadline, "dd MMM")}` : "Ongoing"}
             </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{gig.title}</h3>
          <p className="text-[14px] leading-relaxed text-slate-500 font-medium line-clamp-3 leading-relaxed">
            {gig.description}
          </p>
        </div>

        <div className="mt-auto space-y-6 pt-6 border-t border-black/5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Stipend / Pay</span>
               <p className="text-xl font-black text-[#5227FF] tracking-tight">
                 ₹{gig.payMin.toLocaleString()} - ₹{gig.payMax.toLocaleString()}
               </p>
            </div>
            <div className="w-40 transition-transform hover:scale-105 active:scale-95">
              {action}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
