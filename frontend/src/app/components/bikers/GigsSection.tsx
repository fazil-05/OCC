import React from "react";
import { motion } from "motion/react";
import { GIGS } from "./constants";
import { P } from "../shared/premiumTokens";

export function GigsSection() {
  return (
    <section className="px-6 py-28 md:px-12 md:py-40" style={{ background: P.bg }}>
      <div className="mx-auto grid max-w-[76rem] grid-cols-1 gap-16 md:grid-cols-[1fr_1.15fr] md:gap-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center"
        >
          <p
            className="font-mono-label mb-5 text-[11px] tracking-[0.4em] uppercase"
            style={{ color: P.muted }}
          >
            Earn While You Club
          </p>
          <h2 className="font-headline text-[clamp(3rem,8vw,6rem)] leading-[0.92] tracking-[0.04em]" style={{ color: P.text }}>
            GIG
          </h2>
          <h2 className="font-editorial text-[clamp(2rem,6vw,4.5rem)] leading-[0.92]" style={{ color: P.gold }}>
            Opportunities.
          </h2>
          <p
            className="mt-8 max-w-[340px] text-[15px] leading-[1.8]"
            style={{ color: P.muted, fontFamily: "'DM Sans', sans-serif" }}
          >
            Pick up paid gigs through OCC — photography, hosting, coaching, content. Skills you already have, now they pay.
          </p>

          <div className="mt-10 flex gap-8">
            {[
              { n: "₹800–5K", l: "Per Gig" },
              { n: "50+", l: "Active Gigs" },
              { n: "S1", l: "Now Live" },
            ].map((s) => (
              <div key={s.l}>
                <span className="font-headline text-2xl tracking-wide" style={{ color: P.text }}>
                  {s.n}
                </span>
                <p className="font-mono-label mt-1 text-[10px] tracking-[0.3em] uppercase" style={{ color: P.muted }}>
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <div
          className="flex flex-col"
          style={{ borderTop: `1px solid ${P.border}` }}
        >
          {GIGS.map((gig, i) => (
            <motion.div
              key={gig.title}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group flex items-center justify-between py-6 transition-all duration-[250ms]"
              style={{ borderBottom: `1px solid ${P.border}` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(201,169,110,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                className="font-headline text-lg tracking-[0.06em] transition-colors duration-300 group-hover:text-[#C9A96E]"
                style={{ color: P.text }}
              >
                {gig.title}
              </span>
              <span
                className="font-mono-label text-sm transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: P.gold }}
              >
                {gig.pay}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
