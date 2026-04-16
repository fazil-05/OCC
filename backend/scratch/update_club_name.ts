import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const result = await prisma.club.updateMany({
    where: { name: 'Sports Football' },
    data: { name: 'Sports & Football' }
  })
  console.log(`Updated ${result.count} clubs.`)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
