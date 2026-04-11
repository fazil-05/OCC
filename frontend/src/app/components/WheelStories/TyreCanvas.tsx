import React, { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { GHOST_VEL_THRESHOLD, getTotalAngle } from "./useWheelPhysics";

const SIZE = 700;
const CX = 350;
const CY = 350;
const OUTER_R = 330;
const INNER_R = 265;
const RIM_OUTER = 278;
const RIM_INNER = 268;
const SPOKE_TO = 256;
const HUB_OUTER = 42;
const HUB_MAIN = 38;
const HUB_BOLT_R = 22;
const BOLT_R = 4;
const CAP_R = 11;

export type TyrePhysicsRefs = {
  tyreVelRef: MutableRefObject<number>;
  tyreAngleRef: MutableRefObject<number>;
  wobbleRef: MutableRefObject<number>;
  step: () => void;
};

type TyreCanvasProps = {
  physics: TyrePhysicsRefs;
  onDragEnd?: (totalDeltaX: number) => void;
};

export function TyreCanvas({ physics, onDragEnd }: TyreCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tyreVelRef, tyreAngleRef, wobbleRef, step } = physics;
  const dragRef = useRef<{ startX: number; active: boolean } | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawSpoke = (a: number, vel: number) => {
      const from = HUB_OUTER + 4;
      const to = SPOKE_TO;
      const sx = CX + Math.cos(a) * from;
      const sy = CY + Math.sin(a) * from;
      const ex = CX + Math.cos(a) * to;
      const ey = CY + Math.sin(a) * to;

      if (Math.abs(vel) > GHOST_VEL_THRESHOLD) {
        const offsets = [-0.015, -0.03, -0.045];
        const alphas = [0.25, 0.15, 0.08];
        offsets.forEach((off, i) => {
          const ga = a + off;
          const gsx = CX + Math.cos(ga) * from;
          const gsy = CY + Math.sin(ga) * from;
          const gex = CX + Math.cos(ga) * to;
          const gey = CY + Math.sin(ga) * to;
          ctx.beginPath();
          ctx.moveTo(gsx, gsy);
          ctx.lineTo(gex, gey);
          ctx.strokeStyle = `rgba(160,152,138,${alphas[i]})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        });
      }

      ctx.beginPath();
      ctx.moveTo(sx + 1, sy + 1);
      ctx.lineTo(ex + 1, ey + 1);
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      const grad = ctx.createLinearGradient(sx, sy, ex, ey);
      grad.addColorStop(0, "#A0988A");
      grad.addColorStop(0.5, "#E8E0D0");
      grad.addColorStop(1, "#A8A098");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    };

    const draw = () => {
      step();
      const angle = getTotalAngle(tyreAngleRef.current, wobbleRef.current);
      const vel = tyreVelRef.current;

      ctx.clearRect(0, 0, SIZE, SIZE);

      // Outer rubber (donut)
      ctx.beginPath();
      ctx.arc(CX, CY, OUTER_R, 0, Math.PI * 2);
      ctx.arc(CX, CY, INNER_R, 0, Math.PI * 2, true);
      ctx.fillStyle = "#1A1410";
      ctx.fill("evenodd");

      // Tread bumps
      for (let i = 0; i < 72; i++) {
        const t = (i / 72) * Math.PI * 2 + angle;
        const bx1 = CX + Math.cos(t) * (OUTER_R - 2);
        const by1 = CY + Math.sin(t) * (OUTER_R - 2);
        const bx2 = CX + Math.cos(t) * (OUTER_R + 7);
        const by2 = CY + Math.sin(t) * (OUTER_R + 7);
        ctx.beginPath();
        ctx.moveTo(bx1, by1);
        ctx.lineTo(bx2, by2);
        ctx.strokeStyle = "#2A2420";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      const rimGrad = ctx.createRadialGradient(
        CX - 40,
        CY - 40,
        40,
        CX,
        CY,
        RIM_OUTER,
      );
      rimGrad.addColorStop(0, "#D8D0C0");
      rimGrad.addColorStop(1, "#C0B8A8");
      ctx.beginPath();
      ctx.arc(CX, CY, RIM_OUTER, 0, Math.PI * 2);
      ctx.fillStyle = rimGrad;
      ctx.fill();
      ctx.strokeStyle = "#A8A098";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(CX, CY, RIM_INNER, 0, Math.PI * 2);
      ctx.fillStyle = "#C8C0B0";
      ctx.fill();

      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2 + angle;
        drawSpoke(a, vel);
      }

      ctx.beginPath();
      ctx.arc(CX, CY, HUB_OUTER, 0, Math.PI * 2);
      ctx.fillStyle = "#807870";
      ctx.fill();

      const hubGrad = ctx.createRadialGradient(
        CX - 10,
        CY - 10,
        4,
        CX,
        CY,
        HUB_MAIN,
      );
      hubGrad.addColorStop(0, "#D0C8B8");
      hubGrad.addColorStop(1, "#807870");
      ctx.beginPath();
      ctx.arc(CX, CY, HUB_MAIN, 0, Math.PI * 2);
      ctx.fillStyle = hubGrad;
      ctx.fill();

      for (let i = 0; i < 6; i++) {
        const ba = (i / 6) * Math.PI * 2 + angle * 2;
        const bx = CX + Math.cos(ba) * HUB_BOLT_R;
        const by = CY + Math.sin(ba) * HUB_BOLT_R;
        ctx.beginPath();
        ctx.arc(bx, by, BOLT_R, 0, Math.PI * 2);
        ctx.fillStyle = "#585050";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(bx - 1, by - 1, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(CX, CY, CAP_R, 0, Math.PI * 2);
      ctx.fillStyle = "#C8A96E";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(CX - 1.5, CY - 1.5, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [step, tyreAngleRef, tyreVelRef, wobbleRef]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, active: true };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current?.active) return;
    const d = e.clientX - dragRef.current.startX;
    if (Math.abs(d) > 8) {
      tyreVelRef.current += d * 0.006;
    }
  };
  const endDrag = (e: React.PointerEvent) => {
    if (!dragRef.current?.active) return;
    const total = e.clientX - dragRef.current.startX;
    dragRef.current = null;
    onDragEnd?.(total);
  };

  return (
    <div
      className="pointer-events-auto relative mx-auto select-none"
      style={{
        width: SIZE,
        height: SIZE,
        marginBottom: -340,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        className="block touch-none"
        aria-label="OCC wheel — drag horizontally to spin"
      />
    </div>
  );
}
