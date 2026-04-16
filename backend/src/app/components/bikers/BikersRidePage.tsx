"use client";

import React from "react";
import { Link } from "@/lib/router-compat";
import { useBikersFrames } from "../../../hooks/useBikersFrames";
import { TOTAL_FRAMES, FRAMES_PATH, COLORS } from "./constants";
import { LoadingScreen } from "./LoadingScreen";
import { CustomCursor } from "./CustomCursor";
import { GrainOverlay } from "./GrainOverlay";
import { BikeScrollSection } from "./BikeScrollSection";
import { EventsSection } from "./EventsSection";
import { BikersPulseSection } from "./BikersPulseSection";
import { GigsSection } from "./GigsSection";
import { JoinSection } from "./JoinSection";
import { WheelStoriesSection } from "../WheelStories";

export function BikersRidePage({ 
  hideLoader = false,
  userId
}: { 
  hideLoader?: boolean;
  userId?: string | null;
} = {}) {
  const { frames, loaded, progress } = useBikersFrames(FRAMES_PATH, TOTAL_FRAMES);

  return (
    <div className="cursor-none" style={{ background: COLORS.bg, color: COLORS.text }}>
      {!hideLoader && <LoadingScreen progress={progress} loaded={loaded} />}
      <CustomCursor />
      <GrainOverlay />

      <header className="pointer-events-none fixed top-0 right-0 left-0 z-[100] flex items-center justify-between px-6 py-6 mix-blend-difference md:px-12">
        <Link
          to="/"
          className="pointer-events-auto text-[10px] tracking-[0.4em] uppercase transition-colors duration-300"
          style={{ color: COLORS.text }}
        >
          ← OCC
        </Link>
        <span
          className="font-headline text-lg tracking-[0.15em] md:text-xl"
          style={{ color: COLORS.text }}
        >
          OCC
        </span>
        <span
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{ color: COLORS.muted }}
        >
          Bikers
        </span>
      </header>

      <BikeScrollSection frames={frames} loaded={loaded} />

      <div className="cursor-auto">
        <WheelStoriesSection />
      </div>

      <div className="cursor-auto">
        <EventsSection />
        <BikersPulseSection />
        <GigsSection />
        <JoinSection userId={userId} />
      </div>

      <footer
        className="border-t px-6 py-12 text-center"
        style={{ borderColor: "rgba(255,248,235,0.08)", background: "#0C0C0A" }}
      >
        <p className="font-mono-label text-xs tracking-[0.2em]" style={{ color: "#8A8478" }}>
          OCC Bikers · Scroll Cinema ·{" "}
          <Link to="/" className="transition-colors hover:underline" style={{ color: COLORS.accent }}>
            Return home
          </Link>
        </p>
      </footer>
    </div>
  );
}
