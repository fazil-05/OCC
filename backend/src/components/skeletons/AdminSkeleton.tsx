/**
 * Skeleton placeholder for the admin overview page.
 * Shows stat card outlines while the real counts load.
 */

function Pulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-black/[0.04] ${className}`}
    />
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
      <Pulse className="h-3 w-20" />
      <Pulse className="h-8 w-16" />
      <Pulse className="h-2.5 w-28" />
    </div>
  );
}

export default function AdminSkeleton() {
  return (
    <div className="space-y-8 p-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="space-y-4">
        <Pulse className="h-5 w-36" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Pulse key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );
}
