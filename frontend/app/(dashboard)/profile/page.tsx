import { ClubCard } from "@/components/dashboard/ClubCard";
import { EventCard } from "@/components/dashboard/EventCard";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { GlassCard } from "@/components/ui/GlassCard";
import { requireUser } from "@/lib/auth";
import { avatarSrc } from "@/lib/avatar";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const user = await requireUser();
  const [clubs, events] = await Promise.all([
    prisma.club.findMany({
      where: {
        members: {
          some: { userId: user.id },
        },
      },
    }),
    prisma.eventRegistration.findMany({
      where: { userId: user.id },
      include: {
        event: {
          include: {
            club: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 px-4 sm:px-0 pt-2">
      <GlassCard className="sm:rounded-[32px] p-5 sm:p-8 border-x-0 sm:border border-black/[0.04]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative flex h-16 w-16 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-full bg-slate-100 shadow-xl ring-4 ring-white">
              <img
                src={avatarSrc(user.avatar)}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h1 className="font-sans text-2xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase">{user.fullName}</h1>
              <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[#5227FF] font-bold">{user.collegeName}</p>
              <p className="text-[11px] sm:text-sm text-slate-400 font-medium">Joined {user.createdAt.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: "Clubs", value: clubs.length },
              { label: "Events", value: events.length },
              { label: "Gigs", value: user.gigsApplied.length },
            ].map((item) => (
              <div key={item.label} className="rounded-xl sm:rounded-2xl border border-black/[0.03] bg-white px-3 sm:px-4 py-2 sm:py-3 shadow-sm">
                <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400 font-black">{item.label}</p>
                <p className="mt-1 sm:mt-2 text-lg sm:text-2xl text-slate-900 font-black">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassCard className="sm:rounded-[28px] p-5 sm:p-6 border-x-0 sm:border border-black/[0.04]">
          <div className="mb-6 space-y-1 sm:space-y-2">
            <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.45em] text-[#5227FF] font-black">Identity Management</p>
            <h2 className="font-sans text-xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">Your Details</h2>
          </div>
          <ProfileForm
            initialValues={{
              fullName: user.fullName,
              collegeName: user.collegeName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              bio: user.bio ?? "",
              city: user.city ?? "",
              graduationYear: user.graduationYear ?? undefined,
              avatar: user.avatar ?? "",
            }}
          />
        </GlassCard>

        <div className="space-y-8 sm:space-y-6">
          <div className="space-y-4">
            <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.45em] text-[#5227FF] font-black px-1">My Clusters</p>
            <div className="grid gap-4">
              {clubs.map((club) => (
                <ClubCard 
                  key={club.id} 
                  club={{
                    ...club,
                    coverImage: club.coverImage ?? undefined
                  }} 
                  joined 
                />
              ))}
            </div>

          </div>
          <div className="space-y-4">
            <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.45em] text-[#5227FF] font-black px-1">Active Events</p>
            <div className="grid gap-4">
              {events.map(({ event }) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>

  );
}
