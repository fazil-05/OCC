import { prisma } from "@/lib/prisma";
import { ApprovalsPanel } from "@/components/admin-cp/ApprovalsPanel";

export default async function AdminCPApprovalsPage() {
  const approvals = await prisma.user.findMany({
    where: { role: "CLUB_HEADER", approvalStatus: "PENDING" },
    include: { pendingLeadClub: { select: { name: true, slug: true, icon: true } }, clubManaged: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <ApprovalsPanel
      approvals={approvals.map((a) => ({
        id: a.id, fullName: a.fullName, email: a.email, phoneNumber: a.phoneNumber,
        collegeName: a.collegeName, bio: a.bio, city: a.city, createdAt: a.createdAt.toISOString(),
        club: a.clubManaged ? { name: a.clubManaged.name, slug: a.clubManaged.slug }
          : a.pendingLeadClub ? { name: a.pendingLeadClub.name, slug: a.pendingLeadClub.slug } : null,
      }))}
    />
  );
}
