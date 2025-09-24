import { PrismaClient } from '../../src/generated/prisma/client'
import couponSeeder from './couponSeeder'
import productSeeder from './productSeeder'
import userSeeder from './userSeeder'

const prisma = new PrismaClient()

async function main() {
    await userSeeder(prisma, 10)

    await productSeeder(prisma, { categories: 5, products: 30 })

    await couponSeeder(prisma)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => await prisma.$disconnect())
