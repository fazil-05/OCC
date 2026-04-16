import React from "react";
import { motion } from "motion/react";
import { Link } from "@/lib/router-compat";
import { P } from "../shared/premiumTokens";

export function JoinSection({ userId }: { userId?: string | null }) {
  return (
    <section
      className="relative overflow-hidden px-6 py-32 md:px-12 md:py-44"
      style={{
        background: `radial-gradient(ellipse 60% 50% at 50% 100%, rgba(201,169,110,0.07) 0%, transparent 70%), ${P.card}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${P.border}, transparent)` }}
      />

      <div
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-headline text-[30vw] font-black leading-none tracking-[0.05em] opacity-[0.03]"
        style={{ color: P.text }}
        aria-hidden
      >
        OCC
      </div>

      <motion.div
        initial={{ opacity: 0, y: 44 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        <p
          className="font-mono-label mb-6 text-[11px] tracking-[0.5em] uppercase"
          style={{ color: P.muted }}
        >
          Off Campus Clubs
        </p>
        <h2 className="font-headline text-[clamp(3rem,10vw,6rem)] leading-[0.92] tracking-[0.04em]" style={{ color: P.text }}>
          YOUR CREW
        </h2>
        <h2 className="font-editorial text-[clamp(2.5rem,9vw,5.5rem)] leading-[0.92]" style={{ color: P.gold }}>
          Lives Here.
        </h2>
        <p
          className="mx-auto mt-8 max-w-[520px] text-[16px] leading-[1.8]"
          style={{ color: P.muted, fontFamily: "'DM Sans', sans-serif" }}
        >
          Join OCC — the only platform that connects Gen Z across campuses through real clubs, real events, and real gigs.
        </p>
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            to={userId ? "/clubs/bikers?welcome=true" : "/login"}
            className="font-mono-label px-10 py-[18px] text-[11px] tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02]"
            style={{ background: P.gold, color: P.bg, borderRadius: "2px" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = P.gold;
              e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${P.gold}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = P.gold;
              e.currentTarget.style.color = P.bg;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Join Now
          </Link>
          <Link
            to={userId ? "/clubs" : "/login"}
            className="font-mono-label px-10 py-[18px] text-[11px] tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02]"
            style={{
              color: P.gold,
              boxShadow: `inset 0 0 0 1px ${P.gold}`,
              borderRadius: "2px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = P.gold;
              e.currentTarget.style.color = P.bg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = P.gold;
            }}
          >
            Explore Clubs
          </Link>
        </div>

        <div className="mt-14 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-7 w-7 rounded-full"
                style={{
                  background: `hsl(${35 + i * 12}, ${40 + i * 5}%, ${28 + i * 6}%)`,
                  border: `2px solid ${P.card}`,
                }}
              />
            ))}
          </div>
          <span
            className="text-sm"
            style={{ color: P.muted, fontFamily: "'DM Sans', sans-serif" }}
          >
            2,400+ students across Bangalore
          </span>
        </div>
      </motion.div>
    </section>
  );
}
