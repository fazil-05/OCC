import React, { useEffect, useRef } from "react";
import { FC } from "./MusicConstants";

interface Props {
  visible: boolean;
  intensity: number; // 0–1
}

const N = 64;
const DOTS = Array.from({ length: N }, (_, i) => ({
  x: (i / N) * 100,
  phase: Math.random() * Math.PI * 2,
  speed: 1.2 + Math.random() * 2.0,
  size: 2 + Math.random() * 4,
}));

export function MusicCrowdDots({ visible, intensity }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const t = useRef(0);

  useEffect(() => {
    if (!visible) return;
    let raf = 0;
    const loop = () => {
      t.current += 0.08;
      if (ref.current) {
        const spans = ref.current.querySelectorAll("span");
        spans.forEach((s, i) => {
          const d = DOTS[i];
          const bounce = Math.abs(Math.sin(t.current * d.speed + d.phase));
          const h = bounce * 32 * intensity + 4;
          (s as HTMLElement).style.height = `${h}px`;
          (s as HTMLElement).style.opacity = `${0.4 + bounce * 0.6}`;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [visible, intensity]);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute bottom-0 left-0 z-20 flex w-full items-end justify-around px-2 pb-0"
      style={{ height: 60 }}
    >
      {DOTS.map((d, i) => (
        <span
          key={i}
          className="inline-block rounded-t-sm"
          style={{ 
            width: d.size, 
            height: 4, 
            transition: "none", 
            background: i % 2 === 0 ? FC.accent : "#FFFFFF" 
          }}
        />
      ))}
    </div>
  );
}
