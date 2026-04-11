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
