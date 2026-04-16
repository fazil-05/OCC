/**
 * Skeleton placeholder for the events page.
 */

function Pulse({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-white/[0.06] ${className}`} />
  );
}

function EventCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] overflow-hidden">
      <Pulse className="h-36 w-full !rounded-none" />
      <div className="p-5 space-y-3">
        <Pulse className="h-5 w-3/4" />
        <Pulse className="h-3 w-1/2" />
        <Pulse className="h-9 w-28 !rounded-xl" />
      </div>
    </div>
  );
}

export default function EventsLoading() {
  return (
    <div className="space-y-6 pb-10">
      <div className="space-y-2">
        <Pulse className="h-3 w-16" />
        <Pulse className="h-10 w-64" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
