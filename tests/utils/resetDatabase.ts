import { AppPrismaClient } from '../../src/plugins/prismaPlugin'

export async function resetDatabase(prisma: AppPrismaClient) {
    await prisma.user.deleteMany()
}
