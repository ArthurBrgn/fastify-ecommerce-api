import fp from 'fastify-plugin'
import { PrismaClient } from './../generated/prisma/client.js'

export type AppPrismaClient = PrismaClient<never, { user: { password: true } }>

// Use TypeScript module augmentation to declare the type of server.prisma to be PrismaClient
declare module 'fastify' {
    interface FastifyInstance {
        prisma: AppPrismaClient
    }
}

export default fp(async (server) => {
    const prisma = new PrismaClient({
        omit: {
            user: { password: true }
        }
    })

    await prisma.$connect()

    server.decorate('prisma', prisma)

    server.addHook('onClose', async (server) => {
        await server.prisma.$disconnect()
    })
})
