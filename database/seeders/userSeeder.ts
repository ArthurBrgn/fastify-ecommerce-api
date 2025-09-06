import { faker } from '@faker-js/faker'
import type { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcryptjs'

export default async function userSeeder(prisma: PrismaClient, count: number) {
    // Admin user
    await prisma.user.create({
        data: {
            name: 'Admin',
            email: 'admin@example.com',
            password: hashSync('password', 10),
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            country: faker.location.country(),
            zipcode: faker.location.zipCode()
        }
    })

    for (let i = 0; i < count; i++) {
        await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: hashSync('password', 10),
                street: faker.location.streetAddress(),
                city: faker.location.city(),
                country: faker.location.country(),
                zipcode: faker.location.zipCode()
            }
        })
    }
}
