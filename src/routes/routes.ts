import { FastifyInstance } from 'fastify'

export default function routes(server: FastifyInstance) {
    server.get('/users', async () => {
        const users = await server.prisma.user.findMany()

        return users
    })
}
