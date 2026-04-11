import { prisma } from "@/lib/prisma";
import { gigWhereNotLegacyDummy } from "@/lib/legacyDummyGigs";
import { AdminGigsClient, type AdminGigRow } from "@/components/admin/AdminGigsClient";

export default async function AdminGigsPage() {
  const gigs = await prisma.gig.findMany({
    where: { ...gigWhereNotLegacyDummy },
    orderBy: { createdAt: "desc" },
    include: {
      club: { select: { id: true, name: true, slug: true } },
      postedBy: { select: { id: true, fullName: true, email: true } },
      applications: {
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, fullName: true, email: true, phoneNumber: true },
          },
        },
      },
    },
  });

  const rows: AdminGigRow[] = gigs.map((g) => ({
    id: g.id,
    title: g.title,
    description: g.description,
    payMin: g.payMin,
    payMax: g.payMax,
    createdAt: g.createdAt.toISOString(),
    club: g.club,
    postedBy: g.postedBy,
    applications: g.applications.map((a) => ({
      id: a.id,
      status: a.status,
      message: a.message,
      createdAt: a.createdAt.toISOString(),
      user: a.user,
    })),
  }));

  return <AdminGigsClient gigs={rows} />;
}
