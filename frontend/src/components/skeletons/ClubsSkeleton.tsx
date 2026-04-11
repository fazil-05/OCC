/**
 * Skeleton placeholder for the clubs listing page.
 * Matches the grid layout so there's zero layout shift when data loads.
 */

function Pulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-black/[0.04] ${className}`}
    />
  );
}

function ClubCardSkeleton() {
  return (
    <div className="rounded-3xl bg-white overflow-hidden shadow-sm">
      <Pulse className="h-44 sm:h-56 w-full !rounded-none" />
      <div className="p-5 space-y-3">
        <Pulse className="h-5 w-3/4" />
        <Pulse className="h-3 w-full" />
        <Pulse className="h-3 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Pulse className="h-8 w-24 !rounded-xl" />
          <Pulse className="h-8 w-20 !rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function ClubsSkeleton() {
  return (
    <div className="min-h-screen bg-[#F6F7FA]">
      {/* Header skeleton */}
      <Pulse className="h-[280px] sm:h-[380px] w-full sm:!rounded-[3rem] !rounded-none mb-6 sm:mb-12" />

      <div className="max-w-[1400px] mx-auto px-4">
        {/* Filter bar skeleton */}
        <div className="flex flex-wrap gap-3 mb-10 pb-10 border-b border-black/[0.05]">
          {Array.from({ length: 6 }).map((_, i) => (
            <Pulse key={i} className="h-11 w-28 !rounded-full" />
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8 pb-20">
          {Array.from({ length: 6 }).map((_, i) => (
            <ClubCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
