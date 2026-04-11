import { EventsCRUD } from "@/components/admin-cp/EventsCRUD";
import { prisma } from "@/lib/prisma";

export default async function AdminCPEventsPage() {
  const [events, clubs] = await Promise.all([
    prisma.event.findMany({
      include: { club: { select: { id: true, name: true } }, _count: { select: { registrations: true } } },
      orderBy: { date: "desc" },
    }),
    prisma.club.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <EventsCRUD
      events={events.map((e) => ({ ...e, date: e.date.toISOString(), createdAt: e.createdAt.toISOString() }))}
      clubs={clubs}
    />
  );
}
