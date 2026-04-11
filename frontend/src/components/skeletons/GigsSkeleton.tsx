/**
 * Skeleton placeholder for the gigs listing page.
 */

function Pulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-white/[0.06] ${className}`}
    />
  );
}

function GigCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 space-y-3">
      <Pulse className="h-5 w-3/4" />
      <Pulse className="h-3 w-full" />
      <Pulse className="h-3 w-2/3" />
      <div className="flex gap-3 pt-2">
        <Pulse className="h-9 w-28 !rounded-xl" />
        <Pulse className="h-9 w-20 !rounded-xl" />
      </div>
    </div>
  );
}

export default function GigsSkeleton() {
  return (
    <div className="space-y-6 pb-10">
      <div className="space-y-2">
        <Pulse className="h-3 w-16" />
        <Pulse className="h-10 w-72" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <GigCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
