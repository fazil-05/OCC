import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Calendar, MapPin } from "lucide-react";
import { UPCOMING_EVENTS } from "./constants";

const L = {
  bg: "#EDE9E1",
  text: "#1A1410",
  muted: "#6B6560",
  gold: "#C8A96E",
  row: "rgba(255,255,255,0.5)",
  rowHover: "rgba(255,255,255,0.85)",
  border: "rgba(26,20,16,0.08)",
  borderStrong: "rgba(26,20,16,0.12)",
} as const;

export function EventsSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const watermarkY = useTransform(scrollYProgress, [0, 1], [40, -80]);
  const watermarkOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.04, 0.09, 0.09, 0.04]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-6 py-28 md:px-12 md:py-40"
      style={{ background: L.bg, color: L.text }}
    >
      {/* Giant watermark — parallax on scroll */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none font-headline text-[min(28vw,18rem)] font-bold uppercase leading-none tracking-tighter"
        style={{
          y: watermarkY,
          opacity: watermarkOpacity,
          color: L.text,
        }}
        aria-hidden
      >
        EVENTS
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[76rem]">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 text-center"
        >
          <p
            className="font-mono-label mb-4 text-[11px] tracking-[0.5em] uppercase"
            style={{ color: L.muted }}
          >
            On the calendar
          </p>
          <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] tracking-[0.12em]">UPCOMING EVENTS</h2>
          <motion.div
            className="mx-auto mt-5 h-px w-16"
            style={{ background: L.gold }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mx-auto mb-14 max-w-xl text-center text-sm leading-relaxed md:mb-16"
          style={{ color: L.muted, fontFamily: "'DM Sans', sans-serif" }}
        >
          Real scenes — trivia, open mics, screenings, turf, rides. Save the dates.
        </motion.p>

        {/* Table — desktop */}
        <div className="hidden md:block">
          <div
            className="grid grid-cols-[1.2fr_1fr_1fr] gap-4 border-b pb-4 font-mono-label text-[10px] tracking-[0.35em] uppercase"
            style={{ borderColor: L.borderStrong, color: L.gold }}
          >
            <span>Event</span>
            <span>Date</span>
            <span>Location</span>
          </div>
          {UPCOMING_EVENTS.map((row, i) => (
            <motion.div
              key={row.event}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                scale: 1.01,
                transition: { duration: 0.25 },
              }}
              className="group grid cursor-default grid-cols-[1.2fr_1fr_1fr] gap-4 border-b py-5 backdrop-blur-sm transition-colors duration-300"
              style={{
                borderColor: L.border,
                background: L.row,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = L.rowHover;
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(26,20,16,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = L.row;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span className="font-headline text-[15px] tracking-[0.06em] md:text-base">{row.event}</span>
              <span
                className="flex items-center gap-2 text-sm tabular-nums"
                style={{ color: L.muted, fontFamily: "'DM Sans', sans-serif" }}
              >
                <Calendar size={14} className="shrink-0 opacity-50" style={{ color: L.gold }} />
                {row.date}
              </span>
              <span
                className="flex items-center gap-2 text-sm"
                style={{ color: L.muted, fontFamily: "'DM Sans', sans-serif" }}
              >
                <MapPin size={14} className="shrink-0 opacity-50" style={{ color: L.gold }} />
                {row.location}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Cards — mobile */}
        <div className="flex flex-col gap-4 md:hidden">
          {UPCOMING_EVENTS.map((row, i) => (
            <motion.article
              key={row.event}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border p-5 backdrop-blur-sm"
              style={{
                background: L.row,
                borderColor: L.border,
              }}
            >
              <h3 className="font-headline text-lg tracking-[0.06em]">{row.event}</h3>
              <p className="mt-3 flex items-center gap-2 text-sm tabular-nums" style={{ color: L.muted }}>
                <Calendar size={14} style={{ color: L.gold }} />
                {row.date}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm" style={{ color: L.muted }}>
                <MapPin size={14} style={{ color: L.gold }} />
                {row.location}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
