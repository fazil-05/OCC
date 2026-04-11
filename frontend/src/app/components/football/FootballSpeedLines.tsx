import React from "react";

export function FootballSpeedLines({ intensity }: { intensity: number }) {
  if (intensity < 0.06) return null;
  const opacity = intensity * 0.75;

  return (
    <div className="pointer-events-none absolute inset-0 z-10" style={{ opacity }}>
      <svg className="h-full w-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const cx = 960;
          const cy = 540;
          const len = 280 + intensity * 320;
          const x2 = cx + Math.cos(angle) * len;
          const y2 = cy + Math.sin(angle) * len;
          const sw = 0.6 + intensity * 0.8;
          const sc = i % 3 === 0 ? "#00FF87" : i % 3 === 1 ? "#00C4FF" : "#FFFFFF";
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x2}
              y2={y2}
              stroke={sc}
              strokeWidth={sw}
              strokeOpacity={0.15 + intensity * 0.2}
            />
          );
        })}
      </svg>
    </div>
  );
}
