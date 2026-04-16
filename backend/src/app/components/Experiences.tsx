"use client";

import React, { useRef } from "react";
import { motion } from "motion/react";
import { MovableBlock } from "./LayoutEditor";
import { ScrollTube } from "./Approach";

export function Experiences({ theme }: { theme: "dark" | "light" }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isDark = theme === "dark";

  return (
    <section
      ref={sectionRef}
      className={`relative isolate w-full max-w-[100vw] overflow-visible px-4 py-24 sm:px-6 md:px-12 md:py-32 ${
        isDark ? "bg-[#070914]" : "bg-[#F6F7FA]"
      }`}
    >
      <MovableBlock
        id="experiences-bg-stroke"
        className="pointer-events-none absolute inset-0 z-[1] overflow-visible"
      >
        <ScrollTube containerRef={sectionRef} mirror />
      </MovableBlock>

      <div className="relative z-10 mx-auto mb-16 mt-8 w-full max-w-[90rem] md:mb-24 md:mt-10 lg:mb-28">
        <MovableBlock id="experiences-title">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <h2
              className={`text-left text-[1.125rem] font-medium leading-snug tracking-tighter sm:text-[1.35rem] md:whitespace-nowrap md:text-[1.65rem] lg:text-[1.85rem] xl:text-[2rem] ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Events, gigs, and matchups that hit different
            </h2>
          </motion.div>
        </MovableBlock>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[90rem] grid-cols-1 items-center gap-12 md:gap-20 lg:grid-cols-[1.5fr_1fr] lg:gap-32">
        <MovableBlock id="experiences-visual">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-black shadow-2xl shadow-blue-900/10"
          >
            <div className="pointer-events-none absolute inset-0 z-20 rounded-[2rem] border-[12px] border-black shadow-inner md:border-[20px] lg:border-[24px]" />
            <img
              src="/IMG_20260409_121007.jpg.jpeg"
              alt="Immersive OCC experience visual"
              className="z-10 h-full w-full object-cover"
            />
          </motion.div>
        </MovableBlock>

        <div className="flex flex-col justify-center gap-6 md:gap-8">
          <MovableBlock id="experiences-copy-brand">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className={`text-2xl font-medium tracking-widest ${isDark ? "text-white" : "text-slate-900"}`}>OCC</div>
            </motion.div>
          </MovableBlock>
          <MovableBlock id="experiences-copy-p1">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.26 }}
            >
              <p className={`text-lg font-medium leading-[1.4] md:text-xl lg:text-[1.65rem] ${isDark ? "text-white" : "text-slate-900"}`}>
                We are not another generic campus feed. OCC is built for Gen Z who want real scenes
                off campus—trivia nights, open mics, movie screenings, pickup and turf blocks, and
                curated match setups when you want to play for real.
              </p>
            </motion.div>
          </MovableBlock>
          <MovableBlock id="experiences-copy-p2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.32 }}
            >
              <p className={`text-base font-medium leading-[1.5] md:text-lg lg:text-xl ${isDark ? "text-white/75" : "text-slate-800"}`}>
                Tap into gig listings when you want to earn, discover clubs by interest, and move
                with people who show up for the same energy—whether that is a bike loop, a lens
                crawl, or a lift session.
              </p>
            </motion.div>
          </MovableBlock>
        </div>
      </div>
    </section>
  );
}
