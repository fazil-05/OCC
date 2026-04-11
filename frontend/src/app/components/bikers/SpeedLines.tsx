import React from "react";

const SPEED_LINES = Array.from({ length: 28 }).map((_, i) => {
  const offset = (i - 14) * 55;
  const len = 300 + Math.abs(offset) * 1.5;
  return {
    i,
    x1: 960 + offset,
    y1: 540,
    x2: 960 + offset * 3.2,
    y2: i % 2 === 0 ? 540 - len : 540 + len,
  };
});

export function SpeedLines({ intensity }: { intensity: number }) {
  if (intensity < 0.05) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      style={{ opacity: intensity * 0.7 }}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        {SPEED_LINES.map((line) => (
          <line
            key={line.i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#C8A96E"
            strokeWidth={0.6 + intensity * 0.4}
            strokeOpacity={0.2 + intensity * 0.15}
          />
        ))}
      </svg>
    </div>
  );
}
