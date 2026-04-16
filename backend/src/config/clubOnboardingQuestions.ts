export type {
  ClubOnboardingSlug,
  ClubOnboardingQuestion,
  ClubOnboardingConfig,
} from "./clubOnboardingQuestions.types";

import { QUESTION_BANK } from "./clubOnboardingQuestionBank";
import type {
  ClubOnboardingSlug,
  ClubOnboardingConfig,
} from "./clubOnboardingQuestions.types";

/** Number of rotating question sets per club (each set has 5 questions). */
export const CLUB_ONBOARDING_VARIANT_COUNT = 3;

const CLUB_META: Record<
  ClubOnboardingSlug,
  { clubName: string; clubIcon: string; footerCopy: string }
> = {
  sports: {
    clubName: "Football Club",
    clubIcon: "FC",
    footerCopy: "Personalizing your matchday experience",
  },
  bikers: {
    clubName: "Bikers Club",
    clubIcon: "BK",
    footerCopy: "Setting up your ride profile",
  },
  music: {
    clubName: "Music Club",
    clubIcon: "MU",
    footerCopy: "Tuning your club profile",
  },
  photography: {
    clubName: "Photography Club",
    clubIcon: "PH",
    footerCopy: "Framing your club experience",
  },
  fitness: {
    clubName: "Fitness Club",
    clubIcon: "FT",
    footerCopy: "Building your training profile",
  },
  fashion: {
    clubName: "Fashion Club",
    clubIcon: "FA",
    footerCopy: "Curating your club profile",
  },
};

/** Random index in [0, CLUB_ONBOARDING_VARIANT_COUNT). */
export function pickRandomOnboardingVariantIndex(): number {
  return Math.floor(Math.random() * CLUB_ONBOARDING_VARIANT_COUNT);
}

/**
 * @param variantIndex 0..2 — which of the three question sets to show (persist this with answers for analytics).
 */
export function getClubOnboardingConfig(
  slug: string,
  variantIndex: number = 0,
): ClubOnboardingConfig {
  const s: ClubOnboardingSlug =
    slug in QUESTION_BANK ? (slug as ClubOnboardingSlug) : "sports";
  const vi =
    ((Math.floor(variantIndex) % CLUB_ONBOARDING_VARIANT_COUNT) +
      CLUB_ONBOARDING_VARIANT_COUNT) %
    CLUB_ONBOARDING_VARIANT_COUNT;
  const meta = CLUB_META[s];
  const questions = QUESTION_BANK[s][vi].map((q) => ({ ...q }));
  return {
    slug: s,
    clubName: meta.clubName,
    clubIcon: meta.clubIcon,
    footerCopy: meta.footerCopy,
    questions,
  };
}
