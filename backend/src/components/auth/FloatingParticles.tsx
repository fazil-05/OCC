"use client";

import * as React from "react";

const particles = Array.from({ length: 18 }).map((_, index) => ({
  id: index,
  size: 2 + (index % 4),
  left: `${(index * 11) % 92}%`,
  top: `${(index * 17) % 88}%`,
  delay: `${(index % 7) * 0.6}s`,
}));

export function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute rounded-full bg-[#C9A96E]/35 blur-[1px] animate-[floatParticle_7s_ease-in-out_infinite]"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}
