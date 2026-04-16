import { useCallback, useRef } from "react";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export interface AntigravityState {
  floatY: number;
  tiltDeg: number;
  scaleVal: number;
  speedIntensity: number;
}

export function useAntigravity() {
  const state = useRef<AntigravityState>({
    floatY: 0,
    tiltDeg: 0,
    scaleVal: 1,
    speedIntensity: 0,
  });
  const prevScrollY = useRef(0);

  const update = useCallback((currentScrollY: number): AntigravityState => {
    const velocity = (currentScrollY - prevScrollY.current) / 16;
    prevScrollY.current = currentScrollY;

    const targetFloat = clamp(-velocity * 200, -45, 20);
    const targetTilt = clamp(-velocity * 3.5, -3, 3);
    const targetScale = 1 + Math.abs(velocity) * 0.015;
    const targetSpeed = clamp(Math.abs(velocity) * 40, 0, 1);

    state.current.floatY = lerp(state.current.floatY, targetFloat, 0.08);
    state.current.tiltDeg = lerp(state.current.tiltDeg, targetTilt, 0.08);
    state.current.scaleVal = lerp(state.current.scaleVal, targetScale, 0.08);
    state.current.speedIntensity = lerp(
      state.current.speedIntensity,
      targetSpeed,
      0.1,
    );

    return { ...state.current };
  }, []);

  return { update, state };
}
