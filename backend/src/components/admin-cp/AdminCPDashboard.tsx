"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { pusherClient } from "@/lib/pusher";
import {
  Users,
  Grid3X3,
  CheckCircle2,
  FileText,
  Calendar,
  Briefcase,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Heart,
  MessageCircle,
} from "lucide-react";
import { adminCpHref } from "@/lib/staff-paths";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type SocialRow = {
  id: string;
  kind: "like" | "comment";
  actorName: string;
  summary: string;
  postId: string;
  createdAt: string;
};

type Props = {
  stats: {
    totalUsers: number; activeClubs: number; pendingApprovals: number;
    totalPosts: number; totalEvents: number; totalGigs: number;
    recentSignups: number; alertCount: number;
  };
  recentAudit: { id: string; action: string; entity: string; adminEmail: string; createdAt: string }[];
  recentSocial: SocialRow[];
  recentActivity: {
    id: string;
    actorName: string;
    actorRole: string | null;
    category: string;
    eventType: string;
    summary: string;
    entityType: string | null;
    entityId: string | null;
    createdAt: string;
  }[];
};

export function AdminCPDashboard({ stats, recentAudit, recentSocial, recentActivity }: Props) {
  const [liveSocial, setLiveSocial] = useState(recentSocial);
  const [liveActivity, setLiveActivity] = useState(recentActivity);
  const socialKey = useMemo(
    () => recentSocial.map((r) => `${r.id}:${r.createdAt}`).join("|"),
    [recentSocial],
  );
  const activityKey = useMemo(
    () => recentActivity.map((r) => `${r.id}:${r.createdAt}`).join("|"),
    [recentActivity],
  );

  useEffect(() => {
    setLiveSocial(recentSocial);
  }, [socialKey]);
  useEffect(() => {
    setLiveActivity(recentActivity);
  }, [activityKey]);

  useEffect(() => {
    const client = pusherClient;
    if (!client) return;
    const ch = client.subscribe("admin-global");
    const onSocial = (data: {
      kind?: string;
      actorName?: string;
      summary?: string;
      postId?: string;
      createdAt?: string;
    }) => {
      const id = `rt-${data.kind || "social"}-${Date.now()}`;
      const kind: SocialRow["kind"] = data.kind === "comment" ? "comment" : "like";
      setLiveSocial((prev) =>
        [
          {
            id,
            kind,
            actorName: data.actorName || "Member",
            summary: data.summary || "",
            postId: data.postId || "",
            createdAt: data.createdAt || new Date().toISOString(),
          },
          ...prev,
        ].slice(0, 24),
      );
    };
    ch.bind("social-activity", onSocial);
    ch.bind("activity-event", (data: {
      id?: string;
      actorName?: string;
      actorRole?: string | null;
      category?: string;
      eventType?: string;
      summary?: string;
      entityType?: string | null;
      entityId?: string | null;
      createdAt?: string;
    }) => {
      const id = data.id || `rt-activity-${Date.now()}`;
      setLiveActivity((prev) =>
        [
          {
            id,
            actorName: data.actorName || "Unknown",
            actorRole: data.actorRole ?? null,
            category: data.category || "misc",
            eventType: data.eventType || "event",
            summary: data.summary || "Activity",
            entityType: data.entityType ?? null,
            entityId: data.entityId ?? null,
            createdAt: data.createdAt || new Date().toISOString(),
          },
          ...prev,
        ].slice(0, 30),
      );
    });
    return () => {
      ch.unbind("social-activity", onSocial);
      ch.unbind("activity-event");
      client.unsubscribe("admin-global");
    };
  }, []);

  const cards = [
    { label: "Total Users", value: stats.totalUsers, href: adminCpHref("/users"), icon: Users, color: "#5227FF" },
    { label: "Active Clubs", value: stats.activeClubs, href: adminCpHref("/clubs"), icon: Grid3X3, color: "#00E87A" },
    { label: "Pending Approvals", value: stats.pendingApprovals, href: adminCpHref("/approvals"), icon: CheckCircle2, color: "#FF6B35", highlight: stats.pendingApprovals > 0 },
    { label: "Total Posts", value: stats.totalPosts, href: adminCpHref("/posts"), icon: FileText, color: "#8C6DFD" },
    { label: "Events", value: stats.totalEvents, href: adminCpHref("/events"), icon: Calendar, color: "#00B4D8" },
    { label: "Gigs", value: stats.totalGigs, href: adminCpHref("/gigs"), icon: Briefcase, color: "#D4AF37" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#12183A]/80 to-[#0A0D20] p-8 lg:p-12 border border-white/[0.04]"
      >
        <div className="absolute top-[-20%] right-[-10%] h-[250px] w-[250px] rounded-full bg-[#5227FF]/25 blur-[100px]" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-[#5227FF]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">SaaS Control Center</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
            Full Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5227FF] to-[#8C6DFD]">Control</span>
          </h1>
          <p className="text-sm text-white/50 max-w-lg leading-relaxed">
            Manage clubs, users, content, events, gigs, and platform settings — all from one place. Every action is tracked.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/70">
              <div className="h-2 w-2 rounded-full bg-[#00E87A] shadow-[0_0_6px_#00E87A]" /> System Online
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/70">
              <TrendingUp className="h-3 w-3" /> +{stats.recentSignups} signups this week
            </div>
            {stats.alertCount > 0 && (
              <Link href={adminCpHref("/security")} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-bold text-red-400">
                <ShieldAlert className="h-3 w-3" /> {stats.alertCount} security alerts
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link href={card.href}
              className={`group block relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 ${
                card.highlight
                  ? "bg-gradient-to-br from-[#5227FF]/15 to-[#111122] border border-[#5227FF]/30 shadow-[0_15px_40px_-12px_rgba(82,39,255,0.3)]"
                  : "bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1]"
              }`}
            >
              <div className="absolute top-0 right-0 h-20 w-20 rounded-full opacity-15 blur-[40px]" style={{ background: card.color }} />
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-3 rounded-xl transition-colors" style={{ background: `${card.color}15` }}>
                  <card.icon className="h-5 w-5" style={{ color: card.color }} />
                </div>
                <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-white/60 transition-colors" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/35 mb-1.5">{card.label}</p>
              <p className="text-3xl font-bold tracking-tight text-white tabular-nums">{card.value}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Live social: likes & comments (platform-wide) */}
      {liveSocial.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Recent social activity</h2>
            <span className="text-[10px] uppercase tracking-widest text-white/35">Likes &amp; comments · live</span>
          </div>
          <div className="space-y-2">
            {liveSocial.map((row) => (
              <div
                key={row.id}
                className="flex items-start gap-3 py-2.5 border-b border-white/[0.04] last:border-0"
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    row.kind === "like" ? "bg-red-500/15 text-red-400" : "bg-[#5227FF]/15 text-[#8C6DFD]"
                  }`}
                >
                  {row.kind === "like" ? (
                    <Heart className="h-4 w-4 fill-current" />
                  ) : (
                    <MessageCircle className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-white/90">
                    <span className="font-semibold text-white">{row.actorName}</span>{" "}
                    <span className="text-white/60">{row.summary}</span>
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    {row.postId ? (
                      <Link
                        href={`/p/${row.postId}`}
                        className="text-[10px] text-[#5227FF] hover:underline"
                      >
                        View post
                      </Link>
                    ) : null}
                    <span className="text-[10px] text-white/30">
                      {formatDistanceToNow(new Date(row.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {liveActivity.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent platform activity (7d)</h2>
            <Link href={adminCpHref("/activity")} className="text-xs text-[#5227FF] hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {liveActivity.map((row) => (
              <div key={row.id} className="flex items-start justify-between gap-4 border-b border-white/[0.04] py-2.5 last:border-0">
                <div className="min-w-0">
                  <p className="text-xs text-white/90">
                    <span className="font-semibold text-white">{row.actorName}</span>{" "}
                    <span className="text-white/60">{row.summary}</span>
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-white/35">
                    <span className="rounded bg-white/5 px-1.5 py-0.5 uppercase tracking-wider">
                      {row.category}
                    </span>
                    <span>{row.eventType}</span>
                    {row.actorRole ? <span>· {row.actorRole}</span> : null}
                  </div>
                </div>
                <span className="shrink-0 text-[10px] text-white/30">
                  {formatDistanceToNow(new Date(row.createdAt), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Audit Log */}
      {recentAudit.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Admin audit</h2>
            <Link href={adminCpHref("/audit")} className="text-xs text-[#5227FF] hover:underline">View all →</Link>
          </div>
          <div className="space-y-2">
            {recentAudit.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#5227FF]" />
                  <span className="text-xs text-white/70">{a.adminEmail}</span>
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/50">{a.action}</span>
                  <span className="text-xs text-white/40">{a.entity}</span>
                </div>
                <span className="text-[10px] text-white/30">{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
