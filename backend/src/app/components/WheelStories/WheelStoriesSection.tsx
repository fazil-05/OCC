"use client";

import React, { useCallback, useEffect, useState } from "react";
import { CardArc } from "./CardArc";
import { QuoteDisplay } from "./QuoteDisplay";
import { WHEEL_STORIES } from "./stories.data";
import { TyreCanvas } from "./TyreCanvas";
import { useWheelPhysics } from "./useWheelPhysics";
import "./wheelStories.css";

/**
 * OCC Wheel Stories — Nederburg-style hero: tyre + card arc + quotes.
 * Physics + canvas use refs only in RAF (no useState in the loop).
 */
export function WheelStoriesSection() {
  const physics = useWheelPhysics();

  const [activeIndex, setActiveIndex] = useState(0);
  const [navDir, setNavDir] = useState<1 | -1>(1);
  const [quoteTick, setQuoteTick] = useState(0);
  const n = WHEEL_STORIES.length;

  const onNavigate = useCallback(
    (dir: 1 | -1) => {
      setNavDir(dir > 0 ? 1 : -1);
      physics.triggerSpin(dir);
      setActiveIndex((i) => (i + dir + n) % n);
      setQuoteTick((t) => t + 1);
    },
    [physics, n],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNavigate(1);
      if (e.key === "ArrowLeft") onNavigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onNavigate]);

  const story = WHEEL_STORIES[activeIndex];

  return (
    <section
      className="relative min-h-[100svh] w-full cursor-auto overflow-hidden font-light antialiased"
      style={{
        background: "#EDE9E1",
        color: "#1A1410",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        ["--font-playfair" as string]: "'Playfair Display', Georgia, serif",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, #e4e0d8 0%, #EDE9E1 100%)",
        }}
      />

      {/* Top bar */}
      <header className="relative z-20 flex items-start justify-between px-6 pt-6 md:px-10 md:pt-8">
        <div>
          <div
            className="font-[family-name:var(--font-playfair)] text-[15px] font-bold tracking-wide"
            style={{ color: "#2A1F14" }}
          >
            OCC
          </div>
          <div className="text-[8px] font-normal italic tracking-[0.2em]" style={{ color: "#8A7A6A" }}>
            OFF CAMPUS CLUBS
          </div>
        </div>
        <button
          type="button"
          className="pointer-events-auto flex flex-col gap-1 border-0 bg-transparent p-0"
          aria-label="Menu"
        >
          <span className="h-[1.5px] w-5 bg-[#2A1F14]" />
          <span className="h-[1.5px] w-5 bg-[#2A1F14]" />
          <span className="h-[1.5px] w-5 bg-[#2A1F14]" />
        </button>
      </header>

      {/* Vertical counter */}
      <div
        className="pointer-events-none absolute left-6 top-[140px] z-10 font-mono text-[11px] tracking-[0.35em] md:left-10"
        style={{
          color: "#8A7A6A",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
        }}
      >
        {String(activeIndex + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
      </div>

      {/* Title block */}
      <div className="pointer-events-none absolute right-8 top-[120px] z-10 text-right md:right-12">
        <h2
          className="font-[family-name:var(--font-playfair)] text-[clamp(36px,5.5vw,58px)] font-bold uppercase leading-[0.95] tracking-tight"
          style={{ color: "#1A1410" }}
        >
          OCC
          <br />
          STORIES
        </h2>
        <p
          className="mt-2.5 text-[11px] italic tracking-[0.25em]"
          style={{ color: "#8A7A6A" }}
        >
          Find your tribe.
        </p>
      </div>

      <QuoteDisplay quote={story.quote} quoteTick={quoteTick} />

      <div className="relative z-[15] mx-auto mt-8 max-w-[920px] px-4 pb-[320px] md:mt-12">
        <CardArc
          stories={WHEEL_STORIES}
          activeIndex={activeIndex}
          navDirection={navDir}
          onNavigate={onNavigate}
        />
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] flex justify-center">
        <TyreCanvas
          physics={{
            tyreVelRef: physics.tyreVelRef,
            tyreAngleRef: physics.tyreAngleRef,
            wobbleRef: physics.wobbleRef,
            step: physics.step,
          }}
          onDragEnd={(dx) => {
            if (Math.abs(dx) > 40) onNavigate(dx > 0 ? 1 : -1);
          }}
        />
      </div>

      {/* Nav arrows */}
      <div className="pointer-events-auto absolute bottom-14 left-1/2 z-20 flex -translate-x-1/2 gap-5">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition-colors"
          style={{
            borderColor: "rgba(42,31,20,0.25)",
            background: "rgba(255,255,255,0.65)",
            color: "#2A1F14",
          }}
          aria-label="Previous story"
          onClick={() => onNavigate(-1)}
        >
          ←
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition-colors"
          style={{
            borderColor: "rgba(42,31,20,0.25)",
            background: "rgba(255,255,255,0.65)",
            color: "#2A1F14",
          }}
          aria-label="Next story"
          onClick={() => onNavigate(1)}
        >
          →
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-center">
        <p className="text-[10px] italic tracking-wider" style={{ color: "#B0A090" }}>
          Click arrows to navigate the Stories
        </p>
        <div
          className="relative mx-auto mt-1.5 h-7 w-5 rounded-[10px] border-[1.5px]"
          style={{ borderColor: "#B0A090" }}
        >
          <span
            className="absolute left-1/2 top-1 h-[5px] w-[3px] -translate-x-1/2 rounded-sm"
            style={{ background: "#B0A090" }}
          />
        </div>
      </div>
    </section>
  );
}
