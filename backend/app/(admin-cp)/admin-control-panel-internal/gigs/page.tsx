import { prisma } from "@/lib/prisma";
import { GigsCRUD } from "@/components/admin-cp/GigsCRUD";

export default async function AdminCPGigsPage() {
  const [gigs, clubs] = await Promise.all([
    prisma.gig.findMany({
      include: {
        club: { select: { id: true, name: true } },
        postedBy: { select: { id: true, fullName: true } },
        applications: { include: { user: { select: { id: true, fullName: true, email: true } } }, orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.club.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  const applicationIds = gigs.flatMap((g) => g.applications.map((a) => a.id));
  const verifiedRows =
    applicationIds.length > 0
      ? await prisma.auditLog.findMany({
          where: {
            action: "VERIFY_GIG_SUBMISSION",
            entity: "gig_application",
            entityId: { in: applicationIds },
          },
          select: { entityId: true },
        })
      : [];
  const verifiedSet = new Set(verifiedRows.map((r) => r.entityId).filter(Boolean) as string[]);

  return (
    <GigsCRUD
      gigs={gigs.map((g) => ({
        ...g, createdAt: g.createdAt.toISOString(),
        deadline: g.deadline?.toISOString() || null,
        applications: g.applications.map((a) => ({
          ...a,
          submissionVerified: verifiedSet.has(a.id),
          createdAt: a.createdAt.toISOString(),
        })),
      }))}
      clubs={clubs}
    />
  );
}
