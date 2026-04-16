import { ClubOnboardingEntry } from "@/components/club-onboarding/ClubOnboardingEntry";
import { getSessionUser } from "@/lib/auth";

export default async function Page() {
  const user = await getSessionUser();
  return <ClubOnboardingEntry clubSlug="bikers" userId={user?.id} />;
}
