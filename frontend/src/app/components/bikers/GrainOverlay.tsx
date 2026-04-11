import React from "react";

export function GrainOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.04]">
      <svg className="h-[200%] w-[200%] animate-grain">
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </div>
  );
}
