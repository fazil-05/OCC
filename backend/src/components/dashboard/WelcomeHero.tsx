import { StatsBar } from "@/components/dashboard/StatsBar";
import { GlassCard } from "@/components/ui/GlassCard";

export function WelcomeHero({
  name,
  stats,
}: {
  name: string;
  stats: Array<{ label: string; value: string | number }>;
}) {
  return (
    <GlassCard className="rounded-[30px] border-white/8 bg-[linear-gradient(135deg,rgba(201,169,110,0.08),rgba(0,184,240,0.04))] p-6 md:p-8">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#C9A96E]">Welcome Back</p>
          <div>
            <h1 className="font-headline text-5xl text-[#F5F0E8]">{name.split(" ")[0]}.</h1>
            <p className="mt-3 max-w-2xl text-sm text-[#8A8478]">
              You are inside the OCC network now. Track your clubs, upcoming events, feed drops, and fresh gigs from the community.
            </p>
          </div>
        </div>
        <StatsBar stats={stats} />
      </div>
    </GlassCard>
  );
}
