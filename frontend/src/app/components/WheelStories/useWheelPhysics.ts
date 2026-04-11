import { useCallback, useRef } from "react";

const IMPULSE = 0.18;
const FRICTION = 0.92;
const IDLE = 0.0004;
const STOP = 0.005;
export const GHOST_VEL_THRESHOLD = 0.08;

/** Ref-only tyre physics. `step()` runs once per RAF inside TyreCanvas. */
export function useWheelPhysics() {
  const tyreVelRef = useRef(0);
  const tyreAngleRef = useRef(0);
  const wobbleRef = useRef(0);

  const triggerSpin = useCallback((dir: -1 | 1) => {
    tyreVelRef.current += dir * IMPULSE;
  }, []);

  const step = useCallback(() => {
    const prev = tyreVelRef.current;
    let v = prev * FRICTION;
    tyreVelRef.current = v;
    tyreAngleRef.current += v + IDLE;

    // Mechanical settle: impulse wobble when spin crosses from fast → slow
    if (Math.abs(prev) > STOP && Math.abs(v) <= STOP) {
      wobbleRef.current -= 0.008;
    }
    wobbleRef.current *= 0.82;
    if (Math.abs(wobbleRef.current) < 1e-5) wobbleRef.current = 0;
  }, []);

  return {
    tyreVelRef,
    tyreAngleRef,
    wobbleRef,
    triggerSpin,
    step,
  };
}

export function getTotalAngle(tyreAngle: number, wobble: number): number {
  return tyreAngle + wobble;
}
