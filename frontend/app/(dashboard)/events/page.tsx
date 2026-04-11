import { EventCard } from "@/components/dashboard/EventCard";
import { RegisterEventButton } from "@/components/dashboard/RegisterEventButton";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function EventsPage() {
  const user = await requireUser();
  const events = await prisma.event.findMany({
    include: {
      club: true,
      registrations: {
        where: { userId: user.id },
        select: { id: true },
      },
    },
    orderBy: { date: "asc" },
  });

  return (
    <div className="space-y-12 pb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/5">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#5227FF] font-black">Calendar</p>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5227FF] to-[#8C6DFD]">Events</span></h1>
        </div>
        
        {(user.role === "CLUB_HEADER" || user.role === "ADMIN") && (
          <Link 
            href="/header/events" 
            className="group flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl text-[12px] font-bold uppercase tracking-widest hover:bg-[#5227FF] transition-all shadow-2xl shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <Plus className="h-5 w-5" />
            Post New Event
          </Link>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            action={<RegisterEventButton eventId={event.id} registered={event.registrations.length > 0} />}
          />
        ))}
      </div>
    </div>
  );
}
