import type { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

export default async function userSeeder(prisma: PrismaClient, count: number) {
    for (let i = 0; i < count; i++) {
        await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                address: faker.location.streetAddress(),
                city: faker.location.city(),
                country: faker.location.country(),
                zipcode: faker.location.zipCode(),
            },
        })
    }
}
