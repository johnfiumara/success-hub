const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient({ accelerateUrl: process.env.DATABASE_URL })

  try {
    const user = await prisma.user.findFirst()
    console.log("Success:", user)
  } catch (e) {
    console.error("Error:", e)
  } finally {
    await prisma.$disconnect()
  }
}
main()
