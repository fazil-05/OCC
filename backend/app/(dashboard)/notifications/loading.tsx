/**
 * Notifications page loading skeleton.
 */

function Pulse({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-black/[0.04] ${className}`} />
  );
}

export default function NotificationsLoading() {
  return (
    <div className="space-y-3 pb-10 pt-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white shadow-sm">
          <Pulse className="h-10 w-10 !rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Pulse className="h-4 w-3/4" />
            <Pulse className="h-3 w-1/2" />
          </div>
          <Pulse className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}
