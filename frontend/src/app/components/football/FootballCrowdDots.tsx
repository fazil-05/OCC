import React, { useEffect, useRef } from "react";

interface Props {
  visible: boolean;
  intensity: number; // 0–1
}

const N = 48;
const DOTS = Array.from({ length: N }, (_, i) => ({
  x: (i / N) * 100,
  phase: Math.random() * Math.PI * 2,
  speed: 0.8 + Math.random() * 1.4,
  size: 2 + Math.random() * 2.5,
}));

export function FootballCrowdDots({ visible, intensity }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const t = useRef(0);

  useEffect(() => {
    if (!visible) return;
    let raf = 0;
    const loop = () => {
      t.current += 0.04;
      if (ref.current) {
        const spans = ref.current.querySelectorAll("span");
        spans.forEach((s, i) => {
          const d = DOTS[i];
          const bounce = Math.abs(Math.sin(t.current * d.speed + d.phase));
          const h = bounce * 18 * intensity + 2;
          (s as HTMLElement).style.height = `${h}px`;
          (s as HTMLElement).style.opacity = `${0.3 + bounce * 0.7}`;
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
      className="pointer-events-none absolute bottom-0 left-0 z-20 flex w-full items-end justify-around px-4 pb-2"
      style={{ height: 40 }}
    >
      {DOTS.map((d, i) => (
        <span
          key={i}
          className="inline-block rounded-full bg-white"
          style={{ width: d.size, height: 2, transition: "none" }}
        />
      ))}
    </div>
  );
}
