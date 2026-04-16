import React from "react";
import { motion } from "motion/react";
import { MovableBlock } from "./LayoutEditor";
import { Users, Zap, MapPin, Music, Dumbbell, Camera } from "lucide-react";

const highlights = [
  {
    icon: Users,
    title: "Cross-Campus Crews",
    desc: "Meet students from different colleges who share your vibe — not just your campus.",
  },
  {
    icon: Zap,
    title: "Real Events, Real Energy",
    desc: "Trivia nights, open mics, turf matches, film screenings — stuff you'll actually show up for.",
  },
  {
    icon: MapPin,
    title: "Off-Campus, On Purpose",
    desc: "Break out of the lecture-hall bubble. OCC clubs meet at cafes, turfs, studios & venues across the city.",
  },
];

const interests = [
  { icon: Music, label: "Music" },
  { icon: Dumbbell, label: "Fitness" },
  { icon: Camera, label: "Photo" },
];

export function AboutOCC({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";
  return (
    <section
      id="what-is-occ"
      className={`relative w-full max-w-[100vw] overflow-x-hidden px-4 py-20 sm:px-6 md:px-12 md:py-28 ${
        isDark ? "bg-[#070914]" : "bg-[#F6F7FA]"
      }`}
    >
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-24 lg:gap-32">
          <div className="flex flex-col gap-8">
            <MovableBlock id="about-occ-label">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
              >
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
                  What is OCC?
                </span>
              </motion.div>
            </MovableBlock>

            <MovableBlock id="about-occ-heading">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: 0.08 }}
              >
                <h2
                  className={`text-[2.25rem] font-medium leading-[1.05] tracking-tighter sm:text-[3rem] md:text-[3.5rem] lg:text-[4.25rem] ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  One platform for{" "}
                  <span className="text-indigo-600">every crew</span> that lives
                  off campus
                </h2>
              </motion.div>
            </MovableBlock>

            <MovableBlock id="about-occ-body">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: 0.16 }}
                className="flex flex-col gap-5"
              >
                <p
                  className={`max-w-[36rem] text-base leading-[1.7] md:text-lg ${
                    isDark ? "text-white/65" : "text-slate-600"
                  }`}
                >
                  OCC is a vibrant off-campus platform built for Gen Z students
                  to connect, explore, and grow beyond the boundaries of their
                  colleges. It brings together individuals from different
                  campuses through shared interests — sports, music, fitness,
                  photography, fashion, and more.
                </p>
                <p
                  className={`max-w-[36rem] text-base leading-[1.7] md:text-lg ${
                    isDark ? "text-white/65" : "text-slate-600"
                  }`}
                >
                  From high-energy events like trivia nights, open mics, and
                  match setups to gig opportunities that actually pay — OCC gives
                  you a space where communities thrive and moments last.
                </p>
              </motion.div>
            </MovableBlock>

            <MovableBlock id="about-occ-interests">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.24 }}
                className="flex flex-wrap gap-3 pt-2"
              >
                {interests.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm ring-1 ${
                      isDark
                        ? "bg-white/10 text-white/85 ring-white/15"
                        : "bg-white text-slate-700 ring-slate-200/60"
                    }`}
                  >
                    <Icon size={16} className="text-indigo-500" />
                    {label}
                  </span>
                ))}
                <span className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                  + 4 more clubs
                </span>
              </motion.div>
            </MovableBlock>
          </div>

          <div className="flex flex-col gap-6 md:gap-8 md:pt-12">
            {highlights.map(({ icon: Icon, title, desc }, i) => (
              <MovableBlock key={title} id={`about-occ-highlight-${i}`}>
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  className={`group flex gap-5 rounded-2xl p-6 shadow-sm ring-1 transition-shadow hover:shadow-lg md:p-8 ${
                    isDark
                      ? "bg-white/[0.04] ring-white/10"
                      : "bg-white ring-slate-100"
                  }`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                    <Icon size={24} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3
                      className={`text-lg font-semibold tracking-tight md:text-xl ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed md:text-base ${
                        isDark ? "text-white/60" : "text-slate-500"
                      }`}
                    >
                      {desc}
                    </p>
                  </div>
                </motion.div>
              </MovableBlock>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
