import React from "react";

/** Gold / orange diagonal gradients — film light leak on fast scroll. */
export function PhotographyLightLeaks({ intensity }: { intensity: number }) {
  if (intensity < 0.04) return null;
  const a = Math.min(1, intensity * 0.85);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 mix-blend-screen"
      style={{ opacity: a }}
    >
      <svg className="h-full w-full" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pl-gold" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0" />
            <stop offset="45%" stopColor="#FFD700" stopOpacity={0.35 + intensity * 0.25} />
            <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="pl-orange" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF6B35" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF6B35" stopOpacity={0.2 + intensity * 0.2} />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points="0,0 900,0 400,1080 0,1080" fill="url(#pl-gold)" />
        <polygon points="1920,0 1200,0 1920,900" fill="url(#pl-orange)" />
        <polygon
          points="800,1080 1920,200 1920,1080"
          fill="url(#pl-gold)"
          opacity={0.5 + intensity * 0.3}
        />
      </svg>
    </div>
  );
}
