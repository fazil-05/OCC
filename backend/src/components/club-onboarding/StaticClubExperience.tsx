"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Link } from "@/lib/router-compat";
import { Compass, Sparkles, UserPlus } from "lucide-react";
import type { ClubOnboardingSlug } from "@/config/clubOnboardingQuestions";
import { getClubOnboardingConfig } from "@/config/clubOnboardingQuestions";

const HERO_BY_SLUG: Partial<Record<ClubOnboardingSlug, string>> = {
  music:
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=2000&q=80",
  fitness:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=80",
};

const HIGHLIGHTS: Record<string, { t: string; s: string }[]> = {
  music: [
    { t: "Open mics", s: "Weekly slots · campus venues" },
    { t: "Studio hours", s: "Record & mix with peers" },
    { t: "Collabs", s: "Producers × vocalists × DJs" },
  ],
  fitness: [
    { t: "Group sessions", s: "Strength · run club · mobility" },
    { t: "Challenges", s: "Semester goals & leaderboards" },
    { t: "Coaching", s: "Form checks & programming" },
  ],
};

export function StaticClubExperience({ clubSlug }: { clubSlug: "music" | "fitness" }) {
  const config = getClubOnboardingConfig(clubSlug);
  const hero = HERO_BY_SLUG[clubSlug];
  const highlights = HIGHLIGHTS[clubSlug] ?? [];

  return (
    <div className="min-h-screen bg-[#050508] text-[#F5F1EB]">
      <div className="relative h-[min(72vh,640px)] w-full overflow-hidden">
        {hero ? (
          <Image
            src={hero}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/80 via-transparent to-[#050508]/40" />

        <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8">
          <Link
            to="/"
            className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/70 transition hover:text-white"
          >
            ← OCC
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#C9A96E]">
            {config.clubName}
          </span>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md transition hover:border-[#C9A96E]/50 hover:bg-white/10"
          >
            <Compass className="h-3.5 w-3.5" aria-hidden />
            Explore
          </Link>
        </header>

        <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-12 pt-24 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden />
              <span className="text-[11px] uppercase tracking-[0.25em] text-white/60">OCC club</span>
            </div>
            <h1 className="text-[clamp(2.25rem,6vw,4rem)] font-black uppercase leading-[0.95] tracking-[0.02em]">
              {config.clubName}
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/55">
              {config.footerCopy}. Built for Gen Z on campus — real events, real crews, real gigs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#C9A96E] to-[#E8D5A3] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-[#0C0C0A] shadow-[0_12px_40px_rgba(201,169,110,0.35)] transition hover:scale-[1.02] active:scale-[0.98]"
              >
                <UserPlus className="h-4 w-4" aria-hidden />
                Join OCC
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-white/20 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white/90 transition hover:border-[#C9A96E]/50 hover:bg-white/5"
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#C9A96E]/80">Inside the club</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {highlights.map((item, i) => (
            <motion.div
              key={item.t}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm"
            >
              <p className="text-sm font-semibold text-white">{item.t}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/45">{item.s}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/[0.06] px-5 py-10 text-center sm:px-8">
        <Link to="/" className="text-[11px] uppercase tracking-[0.25em] text-white/35 transition hover:text-[#C9A96E]">
          ← Back to home
        </Link>
      </footer>
    </div>
  );
}
