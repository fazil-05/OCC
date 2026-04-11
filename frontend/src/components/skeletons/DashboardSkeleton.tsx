/**
 * Skeleton placeholder for the dashboard feed page.
 * Shown inside Suspense boundaries while server data streams in.
 * Pure CSS animations — no JS runtime cost.
 */

function Pulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-black/[0.04] ${className}`}
    />
  );
}

export function TrendingClubsSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden px-4 sm:px-0 mb-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2 shrink-0">
          <Pulse className="h-16 w-16 sm:h-20 sm:w-20 !rounded-full" />
          <Pulse className="h-3 w-14" />
        </div>
      ))}
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-3xl bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <Pulse className="h-10 w-10 !rounded-full" />
            <div className="space-y-2 flex-1">
              <Pulse className="h-3 w-28" />
              <Pulse className="h-2.5 w-16" />
            </div>
          </div>
          <Pulse className="h-48 sm:h-64 w-full" />
          <div className="flex gap-4">
            <Pulse className="h-8 w-20 !rounded-xl" />
            <Pulse className="h-8 w-20 !rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RightRailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Pulse className="h-4 w-24" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Pulse key={i} className="h-16 w-full" />
        ))}
      </div>
      <div className="space-y-3">
        <Pulse className="h-4 w-20" />
        {Array.from({ length: 2 }).map((_, i) => (
          <Pulse key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 xl:gap-8">
      <div className="flex-1 min-w-0 flex flex-col pt-2">
        <TrendingClubsSkeleton />
        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-black/5 mt-2">
          <Pulse className="h-9 w-20 !rounded-xl" />
          <Pulse className="h-9 w-24 !rounded-xl" />
          <Pulse className="h-9 w-20 !rounded-xl" />
        </div>
        <FeedSkeleton />
      </div>
      <div className="hidden lg:block w-[260px] xl:w-[280px] shrink-0">
        <RightRailSkeleton />
      </div>
    </div>
  );
}
