import type { Category, PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

export default async function productSeeder(
    prisma: PrismaClient,
    count: { categories: number; products: number }
) {
    const categories: Category[] = []

    for (let i = 0; i < count.categories; i++) {
        const name = `Category ${i + 1}`

        const category = await prisma.category.create({
            data: {
                name,
                slug: faker.helpers.slugify(name)
            }
        })
        categories.push(category)
    }

    for (let i = 0; i < count.products; i++) {
        const name = faker.commerce.productName()

        const category = faker.helpers.arrayElement(categories)

        await prisma.product.create({
            data: {
                name,
                slug: faker.helpers.slugify(name),
                price: parseFloat(faker.commerce.price({ min: 5, max: 200 })),
                stock: faker.number.int({ min: 0, max: 100 }),
                categoryId: category.id
            }
        })
    }
}
