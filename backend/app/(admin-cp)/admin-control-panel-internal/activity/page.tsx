import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { clampActivityWindowDays, DEFAULT_ACTIVITY_WINDOW_DAYS } from "@/lib/activity-events";

export default async function AdminActivityPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  await requireAdmin();
  const daysRaw = searchParams?.days;
  const days = clampActivityWindowDays(
    Number(
      Array.isArray(daysRaw) ? daysRaw[0] : daysRaw || String(DEFAULT_ACTIVITY_WINDOW_DAYS),
    ),
  );
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const rows = await prisma.activityEvent.findMany({
    where: { createdAt: { gte: since } },
    take: 150,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h1 className="text-xl font-semibold text-white">Platform activity timeline</h1>
        <p className="mt-1 text-sm text-white/45">
          Showing latest activity for last {days} day(s). Includes auth, social, content, moderation and profile actions.
        </p>
      </div>

      <div className="space-y-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
        {rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/40">No activity in selected window.</p>
        ) : (
          rows.map((row) => (
            <div key={row.id} className="flex items-start justify-between gap-4 border-b border-white/[0.04] py-2.5 last:border-0">
              <div className="min-w-0">
                <p className="text-sm text-white/90">
                  <span className="font-semibold">{row.actorName}</span>{" "}
                  <span className="text-white/65">{row.summary}</span>
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-white/35">
                  <span className="rounded bg-white/5 px-1.5 py-0.5 uppercase">{row.category}</span>
                  <span>{row.eventType}</span>
                  {row.actorRole ? <span>· {row.actorRole}</span> : null}
                  {row.entityType ? <span>· {row.entityType}</span> : null}
                </div>
              </div>
              <span className="shrink-0 text-[10px] text-white/30">
                {formatDistanceToNow(new Date(row.createdAt), { addSuffix: true })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

