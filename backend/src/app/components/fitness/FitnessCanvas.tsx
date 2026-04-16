"use client";
import React, { useRef, useEffect } from "react";
import { FitnessPlayhead } from "../../../hooks/useFitnessPhysics";

interface FitnessCanvasProps {
  frames: HTMLImageElement[];
  physics: FitnessPlayhead;
}

export function FitnessCanvas({ frames, physics }: FitnessCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || frames.length === 0) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const idx = Math.floor(physics.currentFrame);
    const frame = frames[idx];
    if (!frame) return;

    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

    // Frame blending for ultra-smooth video feel
    const nextIdx = Math.min(idx + 1, frames.length - 1);
    const nextFrame = frames[nextIdx];
    const alpha = physics.currentFrame % 1;
    if (nextFrame && alpha > 0.05) {
      ctx.globalAlpha = alpha;
      ctx.drawImage(nextFrame, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }
  }, [frames, physics.currentFrame]);

  return (
    <div 
      className="absolute inset-0 z-0 h-full w-full pointer-events-none"
      style={{
        transform: `translateY(${physics.floatY}px) rotate(${physics.tiltDeg}deg) scale(${physics.scaleVal})`,
        filter: `brightness(${1 + physics.speedIntensity * 0.2}) contrast(${1 + physics.speedIntensity * 0.1})`,
      }}
    >
      <div 
        className="h-full w-full overflow-hidden"
        style={{ transform: `scale(${physics.zoomVal})` }}
      >
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="h-full w-full object-cover"
        />
      </div>
      
      {/* Dynamic Overlay Glow */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
        style={{ opacity: 0.5 + physics.speedIntensity * 0.5 }}
      />
    </div>
  );
}
