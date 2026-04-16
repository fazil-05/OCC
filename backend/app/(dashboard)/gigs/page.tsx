import { ApplyGigButton } from "@/components/dashboard/ApplyGigButton";
import { GigCard } from "@/components/dashboard/GigCard";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gigWhereNotLegacyDummy } from "@/lib/legacyDummyGigs";

export default async function GigsPage() {
  const user = await requireUser();
  const gigs = await prisma.gig.findMany({
    where: { ...gigWhereNotLegacyDummy },
    include: {
      applications: {
        where: { userId: user.id },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.45em] text-[#C9A96E]">Gigs</p>
        <h1 className="font-headline text-5xl text-[#F5F0E8]">Paid Community Work</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {gigs.map((gig) => (
          <GigCard
            key={gig.id}
            gig={gig}
            action={<ApplyGigButton gigId={gig.id} applied={gig.applications.length > 0} />}
          />
        ))}
      </div>
    </div>
  );
}
