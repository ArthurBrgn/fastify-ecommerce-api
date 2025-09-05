import { AppPrismaClient } from '../../src/plugins/prismaPlugin'

export async function resetDatabase(prisma: AppPrismaClient) {
    await prisma.user.deleteMany({})
    await prisma.category.deleteMany({})
    await prisma.product.deleteMany({})
}
