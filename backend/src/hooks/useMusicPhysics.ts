import { useEffect, useRef, useState } from "react";
import { stickySectionScrollProgress } from "../lib/frameImage";

/**
 * ─── FORWARD-ONLY CINEMATIC PHYSICS ──────────────────────────
 * Goal: Video always plays forward, never reverses or "falls back" during interaction.
 * Provides a "Play on Scroll" feel where the video coasts forward for ~2 seconds.
 */
const DRAG = 0.88;
const EASE_FORWARD = 0.035; // Lower ease for that "2 second video" coast feeling

export interface MusicPlayhead {
  currentFrame: number;
  playheadProgress: number;
  floatY: number;
  tiltDeg: number;
  scaleVal: number;
  zoomVal: number;
  speedIntensity: number;
}

export function useMusicPhysics(
  containerRef: React.RefObject<HTMLElement | null>,
  totalFrames: number,
): MusicPlayhead {
  const physicsFrame = useRef(0);
  const maxTargetSeen = useRef(0);
  const scrollVel = useRef(0);
  const prevTarget = useRef(0);

  // Antigravity FX
  const ag = useRef({
    floatY: 0,
    tiltDeg: 0,
    scaleVal: 1,
    zoomVal: 1,
    speedIntensity: 0,
  });

  const [state, setState] = useState<MusicPlayhead>({
    currentFrame: 0,
    playheadProgress: 0,
    floatY: 0,
    tiltDeg: 0,
    scaleVal: 1,
    zoomVal: 1,
    speedIntensity: 0,
  });

  useEffect(() => {
    let raf = 0;

    const loop = () => {
      const el = containerRef.current;
      if (el) {
        const rawProgress = stickySectionScrollProgress(el);
        const targetFrame = rawProgress * (totalFrames - 1);

        // 1. Monotonic Forward Logic:
        // We track the maximum scroll depth ever reached. 
        // This ensures the video ONLY plays forward and NEVER "falls back" or reverses.
        if (targetFrame > maxTargetSeen.current) {
          maxTargetSeen.current = targetFrame;
        }

        // 2. Smooth Cinematic Coasting:
        // Use a much lower EASE value to simulate the video "playing" smoothly 
        // for a few moments after the scroll interaction triggers it.
        const delta = maxTargetSeen.current - physicsFrame.current;
        
        // Always converge toward the maximum reached point
        physicsFrame.current += delta * EASE_FORWARD;

        // Hard clamp to total frames
        physicsFrame.current = Math.max(0, Math.min(totalFrames - 1, physicsFrame.current));

        // 3. Feedback velocity (for FX only)
        const vDelta = targetFrame - prevTarget.current;
        scrollVel.current += vDelta;
        scrollVel.current *= DRAG;
        prevTarget.current = targetFrame;

        // ─── Visual Post FX (Tilt/Zoom) ──────────────────────────
        const nv = Math.max(-1, Math.min(1, scrollVel.current / 4));
        const absNv = Math.abs(nv);

        ag.current.floatY = ag.current.floatY + ((-nv * 45) - ag.current.floatY) * 0.06;
        ag.current.tiltDeg = ag.current.tiltDeg + ((-nv * 3) - ag.current.tiltDeg) * 0.06;
        ag.current.scaleVal = ag.current.scaleVal + ((1 + absNv * 0.02) - ag.current.scaleVal) * 0.06;
        ag.current.zoomVal = ag.current.zoomVal + ((1 + absNv * 0.03) - ag.current.zoomVal) * 0.05;
        ag.current.speedIntensity = ag.current.speedIntensity + ((Math.min(absNv * 1.5, 1)) - ag.current.speedIntensity) * 0.08;

        setState({
          currentFrame: physicsFrame.current,
          playheadProgress: physicsFrame.current / Math.max(1, totalFrames - 1),
          floatY: ag.current.floatY,
          tiltDeg: ag.current.tiltDeg,
          scaleVal: ag.current.scaleVal,
          zoomVal: ag.current.zoomVal,
          speedIntensity: ag.current.speedIntensity,
        });
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [containerRef, totalFrames]);

  return state;
}
