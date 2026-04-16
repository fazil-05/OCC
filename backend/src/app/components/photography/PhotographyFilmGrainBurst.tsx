import React from "react";

interface Props {
  visible: boolean;
  baseFrequency: number;
  intensity: number;
}

/** Extra grain layer during CAPTURED — feTurbulence baseFrequency animates. */
export function PhotographyFilmGrainBurst({
  visible,
  baseFrequency,
  intensity,
}: Props) {
  if (!visible || intensity < 0.02) return null;

  const bf = Math.max(0.02, Math.min(0.12, baseFrequency));
  const op = 0.06 + intensity * 0.14;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[15]"
      style={{ opacity: op, mixBlendMode: "overlay" }}
    >
      <svg className="h-[200%] w-[200%] animate-grain">
        <filter id="photo-grain-burst">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={bf}
            numOctaves={4}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#photo-grain-burst)" />
      </svg>
    </div>
  );
}
