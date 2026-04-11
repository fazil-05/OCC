import { ClubOnboardingEntry } from "@/components/club-onboarding/ClubOnboardingEntry";

/**
 * High-Fidelity Fitness Club Page
 * Uses the interactive onboarding gate + 621-frame scroll animation
 */
export default function FitnessClubPage() {
  return (
    <ClubOnboardingEntry 
      clubSlug="fitness"
    />
  );
}
