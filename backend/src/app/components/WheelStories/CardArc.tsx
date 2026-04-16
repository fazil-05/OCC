import React from "react";
import type { WheelStory } from "./stories.data";
import { StoryCard } from "./StoryCard";

const SLOTS = [
  { x: -300, y: 140, rot: -24, sc: 0.68, op: 0.38 },
  { x: -155, y: 50, rot: -12, sc: 0.86, op: 0.68 },
  { x: 0, y: 0, rot: 0, sc: 1.08, op: 1.0 },
  { x: 155, y: 50, rot: 12, sc: 0.86, op: 0.68 },
  { x: 300, y: 140, rot: 24, sc: 0.68, op: 0.38 },
] as const;

type CardArcProps = {
  stories: WheelStory[];
  activeIndex: number;
  navDirection: 1 | -1;
  onNavigate: (dir: 1 | -1) => void;
};

export function CardArc({ stories, activeIndex, navDirection, onNavigate }: CardArcProps) {
  const n = stories.length;

  return (
    <div className="pointer-events-none relative mx-auto h-[min(400px,42vh)] w-full max-w-[920px]">
      {SLOTS.map((slot, i) => {
        const idx = ((activeIndex - 2 + i) % n + n) % n;
        const story = stories[idx];
        const staggerMs = (navDirection >= 0 ? i : 4 - i) * 40;
        return (
          <StoryCard
            key={`${activeIndex}-${i}-${idx}`}
            story={story}
            isActive={i === 2}
            slotIndex={i}
            slotStyle={{
              left: "50%",
              top: "38%",
              transform: `translate(calc(-50% + ${slot.x}px), calc(-50% + ${slot.y}px)) rotate(${slot.rot}deg) scale(${slot.sc})`,
              opacity: slot.op,
              transitionDelay: `${staggerMs}ms`,
            }}
            onSelectSide={(next) => onNavigate(next ? 1 : -1)}
          />
        );
      })}
    </div>
  );
}
