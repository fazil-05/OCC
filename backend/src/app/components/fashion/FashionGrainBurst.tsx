import React from "react";

interface Props {
  visible: boolean;
  baseFrequency: number;
  intensity: number;
}

/** Editorial grain burst during climax chapter — separate filter id from photography. */
export function FashionGrainBurst({
  visible,
  baseFrequency,
  intensity,
}: Props) {
  if (!visible || intensity < 0.02) return null;

  const bf = Math.max(0.02, Math.min(0.12, baseFrequency));
  const op = 0.05 + intensity * 0.12;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[15]"
      style={{ opacity: op, mixBlendMode: "overlay" }}
    >
      <svg className="h-[200%] w-[200%] animate-grain">
        <filter id="fashion-grain-burst">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={bf}
            numOctaves={4}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#fashion-grain-burst)" />
      </svg>
    </div>
  );
}
