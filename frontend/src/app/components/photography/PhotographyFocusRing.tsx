import React, { useEffect, useRef } from "react";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function focusPos(progress: number): [number, number] {
  if (progress < 0.15) return [0.5, 0.68];
  if (progress < 0.3) return [0.52, 0.42];
  if (progress < 0.46) return [0.48, 0.35];
  if (progress < 0.65) return [0.5, 0.48];
  return [0.5, 0.5];
}

interface Props {
  scrollProgress: number;
  visible: boolean;
}

export function PhotographyFocusRing({ scrollProgress, visible }: Props) {
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef<[number, number]>([0.5, 0.5]);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const target = focusPos(scrollProgress);
      pos.current[0] = lerp(pos.current[0], target[0], 0.06);
      pos.current[1] = lerp(pos.current[1], target[1], 0.06);
      if (ringRef.current) {
        const [nx, ny] = pos.current;
        const x = nx * window.innerWidth - 28;
        const y = ny * window.innerHeight - 36;
        ringRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [scrollProgress]);

  if (!visible) return null;

  return (
    <div
      ref={ringRef}
      className="pointer-events-none absolute top-0 left-0 z-20 flex flex-col items-center"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <span
        className="mb-1 text-[9px] tracking-[0.35em] uppercase"
        style={{
          color: "#FFD700",
          fontFamily: "'Oswald', sans-serif",
          textShadow: "0 0 8px rgba(255,215,0,0.6)",
        }}
      >
        FOCUS
      </span>
      <div
        className="h-14 w-14 rounded-full border-2"
        style={{
          borderColor: "#FFD700",
          boxShadow:
            "0 0 14px 4px rgba(255,215,0,0.45), inset 0 0 8px rgba(255,215,0,0.15)",
        }}
      />
    </div>
  );
}
