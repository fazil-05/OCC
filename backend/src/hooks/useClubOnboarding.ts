"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getClubOnboardingConfig,
  pickRandomOnboardingVariantIndex,
  type ClubOnboardingSlug,
} from "@/config/clubOnboardingQuestions";

type ClubOnboardingAnswers = Record<"q1" | "q2" | "q3" | "q4" | "q5", string>;

const EMPTY_ANSWERS: ClubOnboardingAnswers = {
  q1: "",
  q2: "",
  q3: "",
  q4: "",
  q5: "",
};

function variantStorageKey(clubSlug: ClubOnboardingSlug) {
  return `occ:onboarding:variant:${clubSlug}`;
}

function postAnswers(payload: {
  userId?: string | null;
  clubSlug: ClubOnboardingSlug;
  answers: ClubOnboardingAnswers;
  questionVariant: number;
}) {
  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/clubs/onboarding", blob);
    return;
  }

  void fetch("/api/clubs/onboarding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

export function useClubOnboarding({
  clubSlug,
  userId,
}: {
  clubSlug: ClubOnboardingSlug;
  userId?: string | null;
}) {
  // SSR-safe deterministic first render to avoid hydration mismatch.
  const [questionVariant, setQuestionVariant] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = variantStorageKey(clubSlug);
    const raw = window.sessionStorage.getItem(key);
    const parsed = raw == null ? NaN : Number.parseInt(raw, 10);
    const resolved = Number.isFinite(parsed)
      ? parsed
      : pickRandomOnboardingVariantIndex();
    window.sessionStorage.setItem(key, String(resolved));
    setQuestionVariant(resolved);
  }, [clubSlug]);

  const config = useMemo(
    () => getClubOnboardingConfig(clubSlug, questionVariant),
    [clubSlug, questionVariant],
  );
  const [answers, setAnswers] = useState<ClubOnboardingAnswers>(EMPTY_ANSWERS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const activeQuestion =
    config.questions[activeIndex] ?? config.questions[Math.max(0, config.questions.length - 1)];
  const answeredCount = useMemo(
    () => Object.values(answers).filter(Boolean).length,
    [answers],
  );

  const submitAnswers = useCallback(
    (nextAnswers: ClubOnboardingAnswers) => {
      if (hasSubmitted) return;
      setHasSubmitted(true);
      postAnswers({
        userId,
        clubSlug,
        answers: nextAnswers,
        questionVariant,
      });
    },
    [clubSlug, hasSubmitted, userId, questionVariant],
  );

  const chooseOption = useCallback(
    (option: string) => {
      if (isAdvancing || isComplete) return;

      const questionKey = activeQuestion.key;
      const nextAnswers = {
        ...answers,
        [questionKey]: option,
      } as ClubOnboardingAnswers;

      setSelectedOption(option);
      setAnswers(nextAnswers);
      setIsAdvancing(true);

      window.setTimeout(() => {
        setSelectedOption(null);
        setIsAdvancing(false);

        if (activeIndex >= config.questions.length - 1) {
          setIsComplete(true);
          submitAnswers(nextAnswers);
          return;
        }

        setActiveIndex((prev) => prev + 1);
      }, 500);
    },
    [
      activeIndex,
      activeQuestion.key,
      answers,
      config.questions.length,
      isAdvancing,
      isComplete,
      submitAnswers,
    ],
  );

  return {
    config,
    answers,
    activeIndex,
    activeQuestion,
    isAdvancing,
    isComplete,
    answeredCount,
    selectedOption,
    chooseOption,
  };
}
