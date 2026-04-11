import React, { useEffect, useRef } from "react";
import { FC } from "./MusicConstants";

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

// Keep it centered as per Music theme requirements
function getBallPos(_progress: number): [number, number] {
  return [0.5, 0.5];
}

interface Props {
  scrollProgress: number;
  visible: boolean;
}

export function MusicBallTracker({ scrollProgress, visible }: Props) {
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
        const x = nx * (typeof window !== 'undefined' ? window.innerWidth : 1920) - 28;
        const y = ny * (typeof window !== 'undefined' ? window.innerHeight : 1080) - 28;
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
        borderColor: FC.accent,
        boxShadow: `0 0 12px 3px ${FC.accent}73, inset 0 0 6px ${FC.accent}33`,
        opacity: visible ? 1 : 0,
      }}
    />
  );
}
