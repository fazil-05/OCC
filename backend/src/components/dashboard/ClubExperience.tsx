"use client";

import dynamic from "next/dynamic";

const BikersRidePage = dynamic(
  () => import("@/app/components/bikers/BikersRidePage").then((mod) => mod.BikersRidePage),
  { ssr: false },
);
const FootballPage = dynamic(
  () => import("@/app/components/football/FootballPage").then((mod) => mod.FootballPage),
  { ssr: false },
);
const PhotographyPage = dynamic(
  () => import("@/app/components/photography/PhotographyPage").then((mod) => mod.PhotographyPage),
  { ssr: false },
);
const FashionPage = dynamic(
  () => import("@/app/components/fashion/FashionPage").then((mod) => mod.FashionPage),
  { ssr: false },
);

export function ClubExperience({ slug }: { slug: string }) {
  if (slug === "bikers") return <BikersRidePage />;
  if (slug === "sports") return <FootballPage />;
  if (slug === "photography") return <PhotographyPage />;
  if (slug === "fashion") return <FashionPage />;
  return null;
}
