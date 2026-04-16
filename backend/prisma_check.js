import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkClubs() {
  try {
    const clubs = await prisma.club.findMany();
    console.log('CLUBS SLUGS:', clubs.map(c => c.slug));
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkClubs();
