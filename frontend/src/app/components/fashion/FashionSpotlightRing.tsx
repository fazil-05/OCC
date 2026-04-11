import React, { useEffect, useRef } from "react";
import { FAC } from "./fashionConstants";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function pos(progress: number): [number, number] {
  if (progress < 0.15) return [0.5, 0.62];
  if (progress < 0.32) return [0.48, 0.4];
  if (progress < 0.48) return [0.52, 0.32];
  if (progress < 0.66) return [0.5, 0.46];
  return [0.5, 0.48];
}

export function FashionSpotlightRing({
  scrollProgress,
  visible,
}: {
  scrollProgress: number;
  visible: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cur = useRef<[number, number]>([0.5, 0.5]);
  const progressRef = useRef(scrollProgress);
  progressRef.current = scrollProgress;

  useEffect(() => {
    if (!visible) return;
    let raf = 0;
    const loop = () => {
      const t = pos(progressRef.current);
      cur.current[0] = lerp(cur.current[0], t[0], 0.055);
      cur.current[1] = lerp(cur.current[1], t[1], 0.055);
      if (ref.current) {
        const [nx, ny] = cur.current;
        const x = nx * window.innerWidth - 56;
        const y = ny * window.innerHeight - 40;
        ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute top-0 left-0 z-20"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <span
        className="mb-2 block text-[9px] tracking-[0.4em] uppercase"
        style={{
          color: FAC.accent,
          fontFamily: "'Oswald', sans-serif",
        }}
      >
        LOOK
      </span>
      <div
        className="h-20 w-28 rounded-[50%] border"
        style={{
          borderColor: "rgba(201,169,98,0.85)",
          boxShadow:
            "0 0 32px 8px rgba(201,169,98,0.25), inset 0 0 24px rgba(247,244,239,0.06)",
        }}
      />
    </div>
  );
}
