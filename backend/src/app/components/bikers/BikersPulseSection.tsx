import React from "react";
import { motion } from "motion/react";
import { Sparkles, Users, Radio } from "lucide-react";

const L = {
  bg: "linear-gradient(145deg, #1A1410 0%, #0E0D0C 100%)",
  text: "#F5F0E8",
  muted: "#9A9088",
  gold: "#C8A96E",
  line: "linear-gradient(90deg, transparent, #C8A96E, transparent)",
} as const;

const highlights = [
  {
    icon: Users,
    label: "Active crews",
    value: "120+",
    sub: "clubs live this term",
  },
  {
    icon: Radio,
    label: "Events hosted",
    value: "48",
    sub: "last 90 days",
  },
  {
    icon: Sparkles,
    label: "Gigs posted",
    value: "200+",
    sub: "paid opportunities",
  },
];

/**
 * Dark contrast band — animated gradient rule + staggered stat cards (between Events & Gigs).
 */
export function BikersPulseSection() {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:px-12 md:py-28" style={{ background: L.bg }}>
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-center"
        style={{ background: L.line }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="relative mx-auto max-w-[76rem]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center md:mb-16"
        >
          <p className="font-mono-label mb-3 text-[10px] tracking-[0.45em] uppercase" style={{ color: L.gold }}>
            OCC Pulse
          </p>
          <h2 className="font-headline text-[clamp(1.5rem,4vw,2.25rem)] tracking-[0.08em]" style={{ color: L.text }}>
            Momentum in numbers
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {highlights.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative rounded-2xl border p-8 transition-shadow duration-500"
              style={{
                borderColor: "rgba(200,169,110,0.2)",
                background: "rgba(255,248,235,0.03)",
                boxShadow: "0 0 0 1px rgba(200,169,110,0.08)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: "radial-gradient(ellipse 120% 80% at 50% 0%, rgba(200,169,110,0.15), transparent 55%)",
                }}
              />
              <item.icon className="relative mb-5" size={22} style={{ color: L.gold }} strokeWidth={1.5} />
              <p className="font-mono-label relative mb-2 text-[10px] tracking-[0.3em] uppercase" style={{ color: L.muted }}>
                {item.label}
              </p>
              <p className="font-headline relative text-[clamp(2rem,5vw,2.75rem)] leading-none tracking-tight" style={{ color: L.text }}>
                {item.value}
              </p>
              <p className="relative mt-3 text-sm" style={{ color: L.muted }}>
                {item.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
