import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotificationsFeed } from "@/components/occ-dashboard/NotificationsFeed";

export default async function NotificationsPage() {
  const user = await requireUser();
  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 80,
  });

  return <NotificationsFeed initial={notifications} userId={user.id} />;
}
