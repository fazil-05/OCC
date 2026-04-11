import { GlassCard } from "@/components/ui/GlassCard";

export function StatsBar({
  stats,
}: {
  stats: Array<{ label: string; value: string | number }>;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {stats.map((stat) => (
        <GlassCard key={stat.label} className="rounded-2xl p-4">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#8A8478]">{stat.label}</p>
          <p className="mt-2 text-2xl text-[#F5F0E8]">{stat.value}</p>
        </GlassCard>
      ))}
    </div>
  );
}
