import { prisma } from "@/lib/prisma";
import { ApprovalsClient } from "@/components/admin/ApprovalsClient";
import type { ApprovalRow } from "@/components/admin/ApprovalCard";

export default async function ApprovalsPage() {
  const approvals = await prisma.user.findMany({
    where: { role: "CLUB_HEADER", approvalStatus: "PENDING" },
    include: {
      clubManaged: true,
      pendingLeadClub: { select: { name: true, slug: true, icon: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const initial: ApprovalRow[] = approvals.map((a) => ({
    id: a.id,
    fullName: a.fullName,
    email: a.email,
    phoneNumber: a.phoneNumber,
    collegeName: a.collegeName,
    bio: a.bio,
    city: a.city,
    createdAt: a.createdAt.toISOString(),
    clubManaged: a.clubManaged
      ? { name: a.clubManaged.name, slug: a.clubManaged.slug, icon: a.clubManaged.icon }
      : a.pendingLeadClub
        ? {
            name: a.pendingLeadClub.name,
            slug: a.pendingLeadClub.slug,
            icon: a.pendingLeadClub.icon,
          }
        : null,
  }));

  return <ApprovalsClient initial={initial} />;
}
