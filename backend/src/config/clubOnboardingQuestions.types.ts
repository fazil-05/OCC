export type ClubOnboardingSlug =
  | "sports"
  | "bikers"
  | "music"
  | "photography"
  | "fitness"
  | "fashion";

export type ClubOnboardingQuestion = {
  key: "q1" | "q2" | "q3" | "q4" | "q5";
  prompt: string;
  options: string[];
};

export type ClubOnboardingConfig = {
  slug: ClubOnboardingSlug;
  clubName: string;
  clubIcon: string;
  footerCopy: string;
  questions: ClubOnboardingQuestion[];
};
