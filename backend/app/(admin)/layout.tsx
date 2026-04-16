import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const pendingCount = await prisma.user.count({
    where: { role: "CLUB_HEADER", approvalStatus: "PENDING" },
  });

  return (
    <AdminShell
      pendingCount={pendingCount}
      adminUser={{
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        notifications: user.notifications ?? [],
      }}
    >
      {children}
    </AdminShell>
  );
}
