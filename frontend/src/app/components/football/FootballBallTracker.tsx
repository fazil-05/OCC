import React, { useEffect, useRef } from "react";

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

// Approximate ball position (0–1 normalised) per scroll progress segment
function getBallPos(progress: number): [number, number] {
  if (progress < 0.15) return [0.5, 0.72];
  if (progress < 0.3)  return [0.5, 0.38];
  if (progress < 0.46) return [0.5, 0.22];
  if (progress < 0.65) return [0.5, 0.45];
  return [0.5, 0.5];
}

interface Props {
  scrollProgress: number;
  visible: boolean; // show between 0.15–0.80
}

export function FootballBallTracker({ scrollProgress, visible }: Props) {
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef<[number, number]>([0.5, 0.5]);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const target = getBallPos(scrollProgress);
      pos.current[0] = lerp(pos.current[0], target[0], 0.05);
      pos.current[1] = lerp(pos.current[1], target[1], 0.05);
      if (ringRef.current) {
        const [nx, ny] = pos.current;
        const x = nx * window.innerWidth - 28;
        const y = ny * window.innerHeight - 28;
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
      className="pointer-events-none absolute top-0 left-0 z-20 h-14 w-14 rounded-full border-2 transition-opacity duration-500"
      style={{
        borderColor: "#00FF87",
        boxShadow: "0 0 12px 3px rgba(0,255,135,0.45), inset 0 0 6px rgba(0,255,135,0.2)",
        opacity: visible ? 1 : 0,
      }}
    />
  );
}
