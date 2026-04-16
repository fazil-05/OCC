import { prisma } from "@/lib/prisma";

/** Fan-out notifications to every ADMIN user (staff visibility / audit trail in-app). */
export async function notifyAllAdmins(
  type: string,
  title: string,
  message: string,
  data?: Record<string, unknown>,
) {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  });
  if (admins.length === 0) return;
  await Promise.all(
    admins.map((a) =>
      prisma.notification.create({
        data: {
          userId: a.id,
          type,
          title,
          message,
          ...(data ? { data: data as object } : {}),
        },
      }),
    ),
  );
}
