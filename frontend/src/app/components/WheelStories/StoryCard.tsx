import React, { useState } from "react";
import type { WheelStory } from "./stories.data";
import "./wheelStories.css";

type StoryCardProps = {
  story: WheelStory;
  isActive: boolean;
  slotStyle: React.CSSProperties;
  onSelectSide: (goNext: boolean) => void;
  slotIndex: number;
};

export function StoryCard({
  story,
  isActive,
  slotStyle,
  onSelectSide,
  slotIndex,
}: StoryCardProps) {
  const center = slotIndex === 2;
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <button
      type="button"
      className="pointer-events-auto absolute origin-bottom cursor-pointer border-0 bg-transparent p-0 text-left transition-[transform,opacity] duration-[650ms] will-change-transform [transform:translateZ(0)]"
      style={{
        width: 175,
        ...slotStyle,
        zIndex: isActive ? 20 : 10 - Math.abs(slotIndex - 2),
        transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        boxShadow: isActive
          ? "0 12px 40px rgba(0,0,0,0.18)"
          : "0 4px 24px rgba(0,0,0,0.1)",
      }}
      onClick={() => {
        if (!center) onSelectSide(slotIndex > 2);
      }}
    >
      <div
        className={`bg-white shadow-[0_4px_24px_rgba(0,0,0,0.1)] ${isActive ? "occ-wheel-card-breathe" : ""}`}
        style={{ transformOrigin: "center bottom" }}
      >
        <div
          className="relative h-[115px] w-full overflow-hidden"
          style={{ background: story.bg }}
        >
          {!imgFailed ? (
            <img
              src={story.image}
              alt=""
              width={175}
              height={115}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-3xl opacity-90"
              aria-hidden
            >
              ✦
            </div>
          )}
        </div>
        <div className="px-3 pb-3 pt-2.5">
          <div className="mb-1.5 h-0.5 w-[22px]" style={{ background: "#C8A96E" }} />
          <div
            className="mb-0.5 text-[9px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "#1A1410" }}
          >
            {story.name}
          </div>
          <div
            className="font-[family-name:var(--font-playfair)] text-[11px] italic"
            style={{ color: "#8A7A6A" }}
          >
            {story.role}
          </div>
        </div>
      </div>
    </button>
  );
}
