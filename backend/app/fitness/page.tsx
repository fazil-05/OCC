import { ClubOnboardingEntry } from "@/components/club-onboarding/ClubOnboardingEntry";
import { getSessionUser } from "@/lib/auth";

/**
 * High-Fidelity Fitness Club Page
 * Uses the interactive onboarding gate + 621-frame scroll animation
 */
export default async function FitnessClubPage() {
  const user = await getSessionUser();
  return (
    <ClubOnboardingEntry 
      clubSlug="fitness"
      userId={user?.id}
    />
  );
}
