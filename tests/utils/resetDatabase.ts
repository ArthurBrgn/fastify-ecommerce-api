import { PrismaClient } from '@prisma/client'

export async function resetDatabase(prisma: PrismaClient) {
    await prisma.user.deleteMany()
}
