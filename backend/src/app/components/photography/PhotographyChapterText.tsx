import React from "react";
import { Link } from "@/lib/router-compat";
import type { PhotographyChapter } from "./photographyConstants";
import { PC } from "./photographyConstants";

function getOpacity(p: number, from: number, peak: number, to: number) {
  if (p < from || p > to) return 0;
  if (p < peak) return (p - from) / (peak - from);
  return 1 - (p - peak) / (to - peak);
}

const POS_CLASSES: Record<PhotographyChapter["position"], string> = {
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
  chapter: PhotographyChapter;
  scrollProgress: number;
}

export function PhotographyChapterText({ chapter: ch, scrollProgress }: Props) {
  const opacity = getOpacity(scrollProgress, ch.from, ch.peak, ch.to);
  if (opacity < 0.005) return null;

  const translateY = (1 - opacity) * 28;
  const isCaptured = ch.id === "captured";

  return (
    <div
      className={`pointer-events-none z-20 ${POS_CLASSES[ch.position]}`}
      style={{ opacity, transform: `translateY(${translateY}px)` }}
    >
      <p
        className="mb-3 text-[10px] tracking-[0.45em] uppercase"
        style={{ color: PC.accent, fontFamily: "'Oswald', sans-serif" }}
      >
        {ch.label}
      </p>

      {isCaptured ? (
        <h2
          className="font-headline leading-none"
          style={{
            fontSize: ch.headlineSize ?? "clamp(100px, 18vw, 260px)",
            color: ch.accentColor ?? PC.accent,
            letterSpacing: "0.08em",
            textShadow:
              "0 0 60px rgba(255,215,0,0.55), 0 0 120px rgba(255,107,53,0.25)",
            transform: `scale(${0.4 + opacity * 0.6})`,
          }}
        >
          {ch.headline[0]}
        </h2>
      ) : (
        <h2 className="font-headline text-4xl leading-[1.0] font-light sm:text-5xl md:text-6xl">
          {ch.headline.map((word, i) => (
            <span
              key={i}
              style={{
                color: ch.accentIndices.includes(i)
                  ? ch.accentColor ?? PC.accent
                  : PC.text,
              }}
            >
              {word}
              {i < ch.headline.length - 1 ? " " : ""}
            </span>
          ))}
        </h2>
      )}

      {ch.sub ? (
        <p
          className="mt-4 text-sm leading-relaxed tracking-wide md:text-base"
          style={{ color: PC.muted }}
        >
          {ch.sub}
        </p>
      ) : null}

      {ch.stat ? (
        <div className="mt-6 flex items-baseline gap-3">
          <span className="font-headline text-4xl" style={{ color: PC.accent }}>
            {ch.stat.number}
          </span>
          <span
            className="text-[10px] tracking-[0.35em] uppercase"
            style={{ color: PC.muted }}
          >
            {ch.stat.label}
          </span>
        </div>
      ) : null}

      {ch.hasCTA ? (
        <div className="pointer-events-auto mt-10 flex justify-center">
          <Link
            to="/"
            className="border px-10 py-4 text-xs tracking-[0.4em] uppercase transition-all duration-300 hover:scale-[1.02]"
            style={{ borderColor: PC.accent, color: PC.accent }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = PC.accent;
              e.currentTarget.style.color = PC.bg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = PC.accent;
            }}
          >
            {ch.ctaText ?? "Join the Club"}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
