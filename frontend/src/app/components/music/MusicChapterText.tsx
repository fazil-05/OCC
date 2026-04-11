import React from "react";
import { Link } from "@/lib/router-compat";
import type { MusicChapter } from "./MusicConstants";
import { FC } from "./MusicConstants";

function getOpacity(p: number, from: number, peak: number, to: number) {
  if (p < from || p > to) return 0;
  if (p < peak) return (p - from) / (peak - from);
  return 1 - (p - peak) / (to - peak);
}

const POS_CLASSES: Record<MusicChapter["position"], string> = {
  "bottom-left":
    "absolute bottom-20 left-6 max-w-[min(100vw-3rem,30rem)] md:left-12 md:bottom-28",
  "top-right":
    "absolute top-20 right-6 max-w-[min(100vw-3rem,30rem)] text-right md:right-12 md:top-28",
  "center-left":
    "absolute top-1/2 left-6 -translate-y-1/2 max-w-[min(100vw-3rem,26rem)] md:left-12",
  "bottom-right":
    "absolute bottom-20 right-6 max-w-[min(100vw-3rem,30rem)] text-right md:right-12 md:bottom-28",
  center:
    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100vw-3rem,52rem)] text-center",
};

interface Props {
  chapter: MusicChapter;
  scrollProgress: number;
}

export function MusicChapterText({ chapter: ch, scrollProgress }: Props) {
  const opacity = getOpacity(scrollProgress, ch.from, ch.peak, ch.to);
  if (opacity < 0.005) return null;

  const translateY = (1 - opacity) * 28;
  const isExplosion = ch.animation === "explosion scale";

  return (
    <div
      className={`pointer-events-none z-20 ${POS_CLASSES[ch.position]}`}
      style={{ opacity, transform: `translateY(${translateY}px)` }}
    >
      <p
        className="mb-3 text-[10px] tracking-[0.45em] uppercase"
        style={{ color: FC.accent, fontFamily: "'Oswald', sans-serif" }}
      >
        {ch.label}
      </p>

      {isExplosion ? (
        <h2
          className="font-headline leading-none"
          style={{
            fontSize: ch.headlineSize ?? "clamp(100px, 18vw, 260px)",
            color: ch.accentColor ?? FC.accent,
            letterSpacing: "0.08em",
            textShadow: `0 0 60px ${ch.accentColor ?? FC.accent}99, 0 0 120px ${ch.accentColor ?? FC.accent}4d`,
            transform: `scale(${0.4 + opacity * 0.6})`,
          }}
        >
          {ch.headline[0]}
        </h2>
      ) : (
        <h2 className="font-headline text-4xl leading-[1.0] font-light sm:text-5xl md:text-6xl">
          {ch.headline.map((word, i) => (
            <span key={i} style={{ color: ch.accentIndices.includes(i) ? (ch.accentColor ?? FC.accent) : "#FFFFFF" }}>
              {word}{i < ch.headline.length - 1 ? " " : ""}
            </span>
          ))}
        </h2>
      )}

      {ch.sub ? (
        <p
          className="mt-4 text-sm leading-relaxed tracking-wide md:text-base"
          style={{ color: "#666666" }}
        >
          {ch.sub}
        </p>
      ) : null}

      {ch.stat ? (
        <div className="mt-6 flex items-baseline gap-3">
          <span className="font-headline text-4xl" style={{ color: FC.accent }}>
            {ch.stat.number}
          </span>
          <span className="text-[10px] tracking-[0.35em] uppercase" style={{ color: "#666666" }}>
            {ch.stat.label}
          </span>
        </div>
      ) : null}

      {ch.hasCTA ? (
        <div className="pointer-events-auto mt-10 flex justify-center">
          <Link
            to="/login"
            className="border px-10 py-4 text-xs tracking-[0.4em] uppercase transition-all duration-300 hover:scale-[1.02]"
            style={{ borderColor: FC.accent, color: FC.accent }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = FC.accent;
              e.currentTarget.style.color = "#060606";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = FC.accent;
            }}
          >
            {ch.ctaText ?? "Join the Club"}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
