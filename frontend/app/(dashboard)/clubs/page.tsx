import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ClubCard } from "@/components/dashboard/ClubCard";
import { Search, MapPin, Sparkles, Filter, LayoutGrid, List } from "lucide-react";

// NEW PREMIUM ASSETS
const PREMIUM_ASSETS: Record<string, string> = {
  "Bikers": "/premium-assets/club_bikers_premium_169_1775157327855.png",
  "Music": "/premium-assets/club_music_premium_169_1775157345029.png",
  "Sports & Football": "/premium-assets/club_football_premium_169_1775157363794.png",
  "Photography": "/premium-assets/club_photography_premium_169_1775157399055.png"
};

export default async function ClubsPage({ searchParams }: { searchParams: { q?: string } }) {
  const user = await requireUser();
  const query = searchParams.q || "";

  const clubsFromDb = await prisma.club.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { createdAt: 'desc' },
  });

  const categories = ["All Clubs", "Elite Sports", "Global Music", "Art & Design", "Technology", "Fashion Explorer"];

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
      <div className="max-w-[1400px] mx-auto px-0 sm:px-4 mb-8 sm:mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 mb-6 sm:mb-10 pb-6 sm:pb-10 border-b border-black/[0.05]">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-4 sm:px-0">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full text-[11px] sm:text-[13px] font-black tracking-wide uppercase transition-all duration-300 shadow-sm border shrink-0 ${i === 0
                  ? "bg-black text-white border-black shadow-xl"
                  : "bg-white text-black/40 border-black/5 hover:border-black/20"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 px-4 sm:px-0 w-full lg:w-auto">
            <div className="relative group flex-1 lg:flex-none">
              <input
                type="text"
                placeholder="Search clubs..."
                className="h-12 sm:h-14 w-full lg:w-80 rounded-xl sm:rounded-2xl bg-white border border-black/5 pl-10 sm:pl-14 pr-6 text-[13px] sm:text-[14px] font-bold text-black placeholder:text-black/20 outline-none transition-all shadow-sm"
              />
              <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-black/20 transition-all" strokeWidth={3} />
            </div>
            <button className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 flex items-center justify-center bg-white rounded-xl sm:rounded-2xl border border-black/5 shadow-sm text-black/40">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* CLUBS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8 pb-20 px-4 sm:px-0">
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
