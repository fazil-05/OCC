import React from "react";

/** Soft vertical runway lights — responds to scroll velocity. */
export function FashionRunwayStreaks({ intensity }: { intensity: number }) {
  if (intensity < 0.04) return null;
  const a = Math.min(1, intensity * 0.9);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 mix-blend-soft-light"
      style={{ opacity: a }}
    >
      <svg className="h-full w-full" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <defs>
          <linearGradient id="fr-s1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C9A962" stopOpacity="0" />
            <stop offset="50%" stopColor="#F7F4EF" stopOpacity={0.12 + intensity * 0.2} />
            <stop offset="100%" stopColor="#D4A5A5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 14 }).map((_, i) => {
          const x = 120 + i * 130;
          const w = 2 + intensity * 3;
          return (
            <rect
              key={i}
              x={x}
              y={-80}
              width={w}
              height={1160}
              fill="url(#fr-s1)"
              opacity={0.15 + (i % 3) * 0.08}
              transform={`skewX(${-4 + (i % 5)})`}
            />
          );
        })}
      </svg>
    </div>
  );
}
