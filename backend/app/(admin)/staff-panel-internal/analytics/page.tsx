import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { staffHref } from "@/lib/staff-paths";
import { AdminAnalyticsCharts, type DayCount } from "@/components/admin/AdminAnalyticsCharts";

function fillDaySeries(
  rows: { day: Date; count: number }[],
  dayCount: number,
): DayCount[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const k = r.day.toISOString().slice(0, 10);
    map.set(k, r.count);
  }
  const out: DayCount[] = [];
  const start = new Date();
  start.setUTCHours(12, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - (dayCount - 1));
  for (let i = 0; i < dayCount; i++) {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    out.push({ day: format(d, "MMM d"), count: map.get(key) ?? 0 });
  }
  return out;
}

export default async function AdminAnalyticsPage() {
  const [
    userRoles,
    memberships,
    events,
    referrals,
    postsTotal,
    postsHidden,
    clubsFrozen,
    usersSuspended,
    pendingHeaders,
    postsByDayRaw,
    referralsByDayRaw,
  ] = await Promise.all([
    prisma.user.groupBy({ by: ["role"], _count: { _all: true } }),
    prisma.clubMembership.count(),
    prisma.eventRegistration.count(),
    prisma.referralStat.count(),
    prisma.post.count(),
    prisma.post.count({ where: { hidden: true } }),
    prisma.club.count({ where: { postingFrozen: true } }),
    prisma.user.count({ where: { suspended: true } }),
    prisma.user.count({ where: { role: "CLUB_HEADER", approvalStatus: "PENDING" } }),
    prisma.$queryRaw<{ day: Date; count: bigint }[]>`
      SELECT date_trunc('day', "createdAt")::date AS day, COUNT(*)::int AS count
      FROM posts
      WHERE "createdAt" >= NOW() - INTERVAL '14 days'
      GROUP BY 1
      ORDER BY 1
    `,
    prisma.$queryRaw<{ day: Date; count: bigint }[]>`
      SELECT date_trunc('day', "registeredAt")::date AS day, COUNT(*)::int AS count
      FROM referral_stats
      WHERE "registeredAt" >= NOW() - INTERVAL '14 days'
      GROUP BY 1
      ORDER BY 1
    `,
  ]);

  const postsSeries = fillDaySeries(
    postsByDayRaw.map((r) => ({ day: r.day, count: Number(r.count) })),
    14,
  );
  const referralsSeries = fillDaySeries(
    referralsByDayRaw.map((r) => ({ day: r.day, count: Number(r.count) })),
    14,
  );

  const roleRows = userRoles.map((g) => ({
    role: g.role,
    count: g._count._all,
  }));

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-[#C9A96E]">Signals</p>
          <h1 className="font-serif text-3xl italic text-[#F5F1EB] md:text-4xl">Analytics</h1>
          <p className="mt-2 max-w-lg text-sm text-white/55">
            Live counts from the database. Export CSV snapshots for offline review.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/api/admin/export?type=summary"
            className="rounded-full border border-[#C9A96E]/40 bg-[#C9A96E]/10 px-4 py-2 text-xs font-medium text-[#C9A96E] transition hover:bg-[#C9A96E]/20"
          >
            Export summary
          </a>
          <a
            href="/api/admin/export?type=users"
            className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/80 transition hover:bg-white/5"
          >
            Export users
          </a>
          <a
            href="/api/admin/export?type=posts"
            className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/80 transition hover:bg-white/5"
          >
            Export posts
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Memberships", value: memberships },
          { label: "Event regs", value: events },
          { label: "Referral joins", value: referrals },
          { label: "Posts (all)", value: postsTotal },
          { label: "Hidden posts", value: postsHidden },
          { label: "Frozen clubs", value: clubsFrozen },
          { label: "Suspended users", value: usersSuspended },
          { label: "Pending headers", value: pendingHeaders },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-[#C9A96E]/20 bg-[rgba(255,248,235,0.04)] p-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">{c.label}</p>
            <p className="mt-2 text-2xl tabular-nums text-[#F5F1EB]">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#C9A96E]/20 bg-[rgba(255,248,235,0.04)] p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C9A96E]">Users by role</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {roleRows.map((r) => (
            <div
              key={r.role}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2"
            >
              <span className="text-sm text-white/80">{r.role}</span>
              <span className="font-mono text-sm text-[#C9A96E]">{r.count}</span>
            </div>
          ))}
        </div>
        <Link href={staffHref("/users")} className="mt-4 inline-block text-xs text-[#C9A96E]/80 hover:text-[#C9A96E]">
          Open user directory →
        </Link>
      </div>

      <AdminAnalyticsCharts postsSeries={postsSeries} referralsSeries={referralsSeries} />
    </div>
  );
}
