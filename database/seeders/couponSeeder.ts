import { faker } from '@faker-js/faker'
import type { PrismaClient } from '@prisma/client'

export default async function couponSeeder(prisma: PrismaClient) {
    await prisma.coupon.create({
        data: {
            code: 'PERCENTAGE10',
            discountType: 'PERCENTAGE',
            discountValue: 10,
            expiresAt: faker.date.future()
        }
    })

    await prisma.coupon.create({
        data: {
            code: 'FIXED10',
            discountType: 'FIXED',
            discountValue: 10,
            expiresAt: faker.date.future()
        }
    })
}
