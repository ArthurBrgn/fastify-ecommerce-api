import { PrismaClient } from '@prisma/client'
import userSeeder from './userSeeder'
import productSeeder from './productSeeder'

const prisma = new PrismaClient()

async function main() {
    await userSeeder(prisma, 10)

    await productSeeder(prisma, { categories: 5, products: 30 })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => await prisma.$disconnect())
