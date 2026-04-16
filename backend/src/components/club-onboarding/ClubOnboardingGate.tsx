"use client";

import { useEffect, useState, type ComponentType } from "react";
import { loadFrameSequence } from "@/lib/loadFrameSequence";
import type { ClubOnboardingSlug } from "@/config/clubOnboardingQuestions";
import { ClubOnboardingFlow } from "@/components/club-onboarding/ClubOnboardingFlow";
import { useClubOnboarding } from "@/hooks/useClubOnboarding";

export function ClubOnboardingGate({
  clubSlug,
  framesPath,
  totalFrames,
  framePrefix = "",
  Experience,
  userId,
  skipFramePreload = false,
}: {
  clubSlug: ClubOnboardingSlug;
  framesPath: string;
  totalFrames: number;
  framePrefix?: string;
  Experience: ComponentType<any>;
  userId?: string | null;
  skipFramePreload?: boolean;
}) {
  const READY_REVEAL_PROGRESS = 0.86;
  const MAX_HOLD_MS = 1200;
  const onboarding = useClubOnboarding({ clubSlug, userId });
  const [frameLoadProgress, setFrameLoadProgress] = useState(0);
  const [frameLoadProgressUi, setFrameLoadProgressUi] = useState(0);
  const [framesPreloadComplete, setFramesPreloadComplete] = useState(false);
  const [experienceMounted, setExperienceMounted] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [holdStartedAt, setHoldStartedAt] = useState<number | null>(null);

  // Start loading immediately on mount (during questions). No loadStarted ref:
  // React Strict Mode remounts would skip the second effect and leave progress
  // stuck at 0%. Progress is broadcast to all subscribers (see loadFrameSequence).
  useEffect(() => {
    if (skipFramePreload) {
      setFrameLoadProgress(1);
      setFrameLoadProgressUi(1);
      setFramesPreloadComplete(true);
      setExperienceMounted(true);
      return;
    }

    let released = false;

    void loadFrameSequence(
      framesPath,
      totalFrames,
      (p) => {
        if (released) return;
        setFrameLoadProgress(p);
      },
      framePrefix,
    ).then(() => {
      if (released) return;
      setFrameLoadProgress(1);
      setFrameLoadProgressUi(1);
      setFramesPreloadComplete(true);
      setExperienceMounted(true);
    });

    return () => {
      released = true;
    };
  }, [framesPath, totalFrames, skipFramePreload, framePrefix]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setFrameLoadProgressUi((prev) => {
        const target = Math.min(1, Math.max(0, frameLoadProgress));
        const next = prev + (target - prev) * 0.16;
        return Math.abs(next - target) < 0.001 ? target : next;
      });
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [frameLoadProgress]);

  // Mount experience as soon as we have enough frames for smooth first playback.
  useEffect(() => {
    if (experienceMounted) return;
    if (skipFramePreload || framesPreloadComplete || frameLoadProgressUi >= READY_REVEAL_PROGRESS) {
      setExperienceMounted(true);
    }
  }, [
    experienceMounted,
    skipFramePreload,
    framesPreloadComplete,
    frameLoadProgressUi,
    READY_REVEAL_PROGRESS,
  ]);

  useEffect(() => {
    if (!onboarding.isComplete) {
      if (holdStartedAt !== null) setHoldStartedAt(null);
      return;
    }
    if (holdStartedAt === null) setHoldStartedAt(performance.now());
  }, [onboarding.isComplete, holdStartedAt]);

  // Reveal when onboarding is complete + enough frames are ready OR after timeout.
  useEffect(() => {
    if (
      !experienceMounted ||
      !onboarding.isComplete ||
      revealing ||
      revealed
    ) {
      return;
    }

    const elapsed = holdStartedAt == null ? 0 : performance.now() - holdStartedAt;
    const readyToReveal =
      skipFramePreload ||
      framesPreloadComplete ||
      frameLoadProgressUi >= READY_REVEAL_PROGRESS ||
      elapsed >= MAX_HOLD_MS;
    if (!readyToReveal) return;

    const startReveal = window.setTimeout(() => {
      setRevealing(true);
    }, 120);

    return () => window.clearTimeout(startReveal);
  }, [
    experienceMounted,
    framesPreloadComplete,
    frameLoadProgressUi,
    holdStartedAt,
    skipFramePreload,
    onboarding.isComplete,
    revealed,
    revealing,
    READY_REVEAL_PROGRESS,
    MAX_HOLD_MS,
  ]);

  useEffect(() => {
    if (!revealing) return;

    const finishReveal = window.setTimeout(() => {
      setRevealed(true);
    }, 700);

    return () => window.clearTimeout(finishReveal);
  }, [revealing]);

  const assetsLoadProgress =
    !skipFramePreload && !framesPreloadComplete ? frameLoadProgressUi : null;

  return (
    <>
      {experienceMounted ? <Experience userId={userId} /> : null}
      {!revealed ? (
        <ClubOnboardingFlow
          config={onboarding.config}
          activeIndex={onboarding.activeIndex}
          activePrompt={onboarding.activeQuestion.prompt}
          answeredCount={onboarding.answeredCount}
          selectedOption={onboarding.selectedOption}
          isAdvancing={onboarding.isAdvancing}
          phase={
            revealing
              ? "revealing"
              : onboarding.isComplete
                ? "holding"
                : "questions"
          }
          onChooseOption={onboarding.chooseOption}
          assetsLoadProgress={assetsLoadProgress}
        />
      ) : null}
    </>
  );
}
