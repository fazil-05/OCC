import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const clubs = await prisma.club.findMany();

  for (const club of clubs) {
    console.log(`Seeding content for club: ${club.name}`);

    // Create a dummy user to be the author
    const dummyUser = await prisma.user.upsert({
      where: { email: `dummy_${club.slug}@example.com` },
      update: {},
      create: {
        email: `dummy_${club.slug}@example.com`,
        fullName: `${club.name} Leader`,
        collegeName: "Mad University",
        password: "hashedpassword123", // Doesn't matter
        phoneNumber: `+100000${Math.floor(Math.random() * 9000) + 1000}`,
      },
    });

    // Make member
    await prisma.clubMembership.upsert({
      where: { userId_clubId: { userId: dummyUser.id, clubId: club.id } },
      update: {},
      create: { userId: dummyUser.id, clubId: club.id },
    });

    // Create 3 Posts
    for (let i = 1; i <= 3; i++) {
      await prisma.post.create({
        data: {
          clubId: club.id,
          userId: dummyUser.id,
          caption: `Exciting update #${i} from ${club.name}! Join our upcoming activities.`,
          imageUrl: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?w=500&q=80`,
          likesCount: Math.floor(Math.random() * 50) + 10,
        },
      });
    }

    // Create 2 Events
    for (let i = 1; i <= 2; i++) {
      await prisma.event.create({
        data: {
          clubId: club.id,
          title: `${club.name} Meetup 2026 Part ${i}`,
          description: `Join us for an exclusive gathering of ${club.name} members.`,
          date: new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000), // Future dates
          venue: "Main Campus Auditorium",
          price: 0,
          maxCapacity: 100,
        },
      });
    }

    // Create 2 Gigs
    for (let i = 1; i <= 2; i++) {
      await prisma.gig.create({
        data: {
          clubId: club.id,
          title: `${club.name} Event Coordinator`,
          description: `We are looking for someone to help organize our upcoming events.`,
          payMin: 50,
          payMax: 150,
        },
      });
    }
  }

  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
