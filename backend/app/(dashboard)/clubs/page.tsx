import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ClubCard } from "@/components/dashboard/ClubCard";
import { ClubsHubControls } from "@/components/dashboard/ClubsHubControls";
import { clubHubWhere } from "@/lib/clubCategoryFilter";
import { Sparkles } from "lucide-react";

// NEW PREMIUM ASSETS
const PREMIUM_ASSETS: Record<string, string> = {
  "Bikers": "/premium-assets/club_bikers_premium_169_1775157327855.png",
  "Music": "/premium-assets/club_music_premium_169_1775157345029.png",
  "Sports & Football": "/premium-assets/club_football_premium_169_1775157363794.png",
  "Photography": "/premium-assets/club_photography_premium_169_1775157399055.png"
};

export default async function ClubsPage({
  searchParams,
}: {
  searchParams: { q?: string; cat?: string };
}) {
  await requireUser();

  const where = clubHubWhere(searchParams.cat, searchParams.q);

  const clubsFromDb = await prisma.club.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#F6F7FA]">

      {/* IMMERSIVE HEADER */}
      <section className="relative h-[280px] sm:h-[380px] w-full overflow-hidden sm:rounded-[3rem] bg-black mb-6 sm:mb-12 shadow-2xl">
        <div
          className="absolute inset-0 opacity-40 blur-[80px] scale-150"
          style={{ backgroundImage: `url(${PREMIUM_ASSETS["Bikers"]})`, backgroundSize: 'cover' }}
        />
        <img
          src={PREMIUM_ASSETS["Bikers"]}
          className="absolute inset-0 h-full w-full object-cover opacity-60 brightness-75 sm:brightness-50"
          alt="Header background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 bg-white/10 backdrop-blur-3xl px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full border border-white/20 shadow-2xl">
            <Sparkles className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-[#D4AF37]" fill="currentColor" />
            <span className="text-[9px] sm:text-[12px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white">Elite Experiences</span>
          </div>
          <h1 className="text-4xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter mb-2 sm:mb-4 leading-none uppercase">
            Find Your <span className="font-serif italic font-normal text-[#D4AF37]">People.</span>
          </h1>
          <p className="max-w-sm sm:max-w-xl text-[14px] sm:text-[16px] font-medium text-white/50 leading-relaxed sm:leading-relaxed">
            Exclusive communities curated for the industry's movers and shakers.
          </p>
        </div>
      </section>

      {/* FILTER & CONTROL CENTER */}
      <div className="mx-auto mb-8 max-w-[1400px] px-0 sm:mb-12 sm:px-4">
        <Suspense
          fallback={
            <div className="mb-10 h-28 animate-pulse rounded-2xl bg-black/[0.04] px-4 sm:px-0" />
          }
        >
          <ClubsHubControls />
        </Suspense>

        {/* CLUBS GRID */}
        <div className="grid grid-cols-1 gap-4 pb-20 sm:gap-8 md:grid-cols-2 xl:grid-cols-3 sm:px-0">
          {clubsFromDb.map((club) => {
            let clubImg = club.coverImage || "";
            const cn = club.name;
            if (PREMIUM_ASSETS[cn]) clubImg = PREMIUM_ASSETS[cn];

            return (
              <ClubCard
                key={club.id}
                club={{
                  ...club,
                  coverImage: clubImg
                }}
              />
            );
          })}
        </div>
      </div>

    </div>
  );
}
