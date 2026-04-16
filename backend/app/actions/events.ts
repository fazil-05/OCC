"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  const user = await requireUser();
  
  if (user.role !== "CLUB_HEADER" && user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const venue = formData.get("venue") as string;
  const dateStr = formData.get("date") as string;
  const price = parseInt(formData.get("price") as string) || 0;
  const maxCapacity = parseInt(formData.get("maxCapacity") as string) || undefined;
  const imageUrl = formData.get("imageUrl") as string || "";

  if (!user.clubManagedId && user.role !== "ADMIN") {
     throw new Error("Club Header must manage a club to post events");
  }

  const clubId = user.clubManagedId || (formData.get("clubId") as string);

  if (!clubId) {
    throw new Error("Club ID is required");
  }

  await prisma.event.create({
    data: {
      title,
      description,
      venue,
      date: new Date(dateStr),
      price,
      maxCapacity,
      imageUrl,
      clubId,
    },
  });

  revalidatePath("/events");
  revalidatePath("/dashboard");
  revalidatePath("/header/events");
  
  return { success: true };
}

export async function getEventRegistrants(eventId: string) {
  const user = await requireUser();
  
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { club: true }
  });

  if (!event) throw new Error("Event not found");

  // Only allow Admin or the specific Club Header of that club to see registrants
  if (user.role !== "ADMIN" && user.clubManagedId !== event.clubId) {
    throw new Error("Unauthorized access to registrant list");
  }

  const registrants = await prisma.eventRegistration.findMany({
    where: { eventId },
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
          phoneNumber: true,
          collegeName: true,
          graduationYear: true,
          avatar: true,
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return registrants;
}
