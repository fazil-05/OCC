import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { backfillClubMemberDisplayBases, OCC_DEFAULT_CLUBS } from "../src/lib/occDefaultClubs";
import { randomMemberDisplayBase } from "../src/lib/socialDisplay";
import { LEGACY_DUMMY_GIG_IDS } from "../src/lib/legacyDummyGigs";

const prisma = new PrismaClient();

async function main() {
  await prisma.gig.deleteMany({
    where: { id: { in: LEGACY_DUMMY_GIG_IDS } },
  });

  const staffEmail = process.env.OCC_STAFF_ADMIN_EMAIL;
  const staffPassword = process.env.OCC_STAFF_ADMIN_PASSWORD;
  if (!staffEmail || !staffPassword) {
    throw new Error("OCC_STAFF_ADMIN_EMAIL and OCC_STAFF_ADMIN_PASSWORD must be set for seeding.");
  }
  const adminHash = await bcrypt.hash(staffPassword, 12);
  await prisma.user.upsert({
    where: { email: staffEmail },
    update: {
      password: adminHash,
      role: "ADMIN",
      approvalStatus: "APPROVED",
    },
    create: {
      id: "seed-admin-occ-staff",
      fullName: "OCC Staff",
      collegeName: "OCC HQ",
      phoneNumber: "0000000001",
      email: staffEmail,
      password: adminHash,
      role: "ADMIN",
      approvalStatus: "APPROVED",
    },
  });

  for (const club of OCC_DEFAULT_CLUBS) {
    await prisma.club.upsert({
      where: { slug: club.slug },
      update: {},
      create: { ...club, memberDisplayBase: randomMemberDisplayBase() },
    });
  }
  await backfillClubMemberDisplayBases(prisma);

  const clubMap = await prisma.club.findMany();
  const clubBySlug = Object.fromEntries(clubMap.map((club) => [club.slug, club]));

  if (clubBySlug.bikers) {
    await prisma.event.upsert({
      where: { id: "seed-bikers-dawn-ride" },
      update: {},
      create: {
        id: "seed-bikers-dawn-ride",
        clubId: clubBySlug.bikers.id,
        title: "Dawn Ride To Nandi",
        description: "Sunrise loop, breakfast stop, and route film drops.",
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
        venue: "Hebbal Meet Point",
        price: 399,
        imageUrl:
          "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
      },
    });
  }

  if (clubBySlug.photography) {
    await prisma.event.upsert({
      where: { id: "seed-photo-nightwalk" },
      update: {},
      create: {
        id: "seed-photo-nightwalk",
        clubId: clubBySlug.photography.id,
        title: "Night Walk Photo Jam",
        description: "Golden-hour portraits and low-light city frames.",
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6),
        venue: "Church Street",
        price: 199,
        imageUrl:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
      },
    });
  }

  console.log("Clubs seeded.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
