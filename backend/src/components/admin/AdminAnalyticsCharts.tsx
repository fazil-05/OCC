"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type DayCount = { day: string; count: number };

const axisStyle = { fontSize: 10, fill: "rgba(245,241,235,0.45)" };

export function AdminAnalyticsCharts({
  postsSeries,
  referralsSeries,
}: {
  postsSeries: DayCount[];
  referralsSeries: DayCount[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-[#C9A96E]/20 bg-[rgba(255,248,235,0.04)] p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C9A96E]">Posts / day</p>
        <p className="mt-1 text-sm text-white/50">Last 14 days</p>
        <div className="mt-4 h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={postsSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gPosts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A96E" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#C9A96E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" tick={axisStyle} tickLine={false} axisLine={{ stroke: "rgba(201,169,110,0.2)" }} />
              <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={28} />
              <Tooltip
                contentStyle={{
                  background: "#141410",
                  border: "1px solid rgba(201,169,110,0.35)",
                  borderRadius: 12,
                  color: "#F5F1EB",
                  fontSize: 12,
                }}
                labelStyle={{ color: "#C9A96E" }}
              />
              <Area type="monotone" dataKey="count" stroke="#C9A96E" fill="url(#gPosts)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-[#C9A96E]/20 bg-[rgba(255,248,235,0.04)] p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#00E87A]">Referral joins / day</p>
        <p className="mt-1 text-sm text-white/50">Last 14 days</p>
        <div className="mt-4 h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={referralsSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gRef" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00E87A" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00E87A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" tick={axisStyle} tickLine={false} axisLine={{ stroke: "rgba(0,232,122,0.2)" }} />
              <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={28} />
              <Tooltip
                contentStyle={{
                  background: "#141410",
                  border: "1px solid rgba(0,232,122,0.35)",
                  borderRadius: 12,
                  color: "#F5F1EB",
                  fontSize: 12,
                }}
                labelStyle={{ color: "#00E87A" }}
              />
              <Area type="monotone" dataKey="count" stroke="#00E87A" fill="url(#gRef)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
