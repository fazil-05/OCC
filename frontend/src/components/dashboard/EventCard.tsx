import { format } from "date-fns";
import { CalendarDays, MapPin } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export function EventCard({
  event,
  action,
}: {
  event: {
    title: string;
    description: string;
    venue: string;
    date: Date | string;
    imageUrl?: string | null;
    club?: { name: string; icon: string } | null;
    price?: number;
  };
  action?: React.ReactNode;
}) {
  const date = typeof event.date === "string" ? new Date(event.date) : event.date;

  return (
    <div className="overflow-hidden rounded-[32px] bg-white border border-black/5 shadow-[0_4px_24px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] group">
      <div
        className="h-64 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.6) 100%), url(${event.imageUrl || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80"})`,
        }}
      />
      <div className="space-y-5 p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            {event.club ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-[#5227FF]/10 bg-[#5227FF]/5 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#5227FF]">
                 {event.club.name}
              </span>
            ) : null}
            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{event.title}</h3>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-black text-[#5227FF] tracking-tighter">
              {format(date, "dd")}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {format(date, "MMM")}
            </span>
          </div>
        </div>
        
        <p className="text-[14px] leading-relaxed text-slate-500 font-medium line-clamp-2">
          {event.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 border-t border-black/5 pt-6">
          <p className="inline-flex items-center gap-2.5">
            <MapPin className="h-4 w-4 text-[#5227FF]" />
            {event.venue}
          </p>
          <p className="inline-flex items-center gap-2.5">
            <CalendarDays className="h-4 w-4 text-[#5227FF]" />
            {format(date, "h:mm a")}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Entry Fee</span>
            <span className="text-lg font-black text-slate-900">
              {typeof event.price === "number" ? `₹${event.price}` : "Free Entry"}
            </span>
          </div>
          <div className="transition-transform hover:scale-105 active:scale-95">
            {action}
          </div>
        </div>
      </div>
    </div>
  );
}
