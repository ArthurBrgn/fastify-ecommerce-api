import fastifyJwt from '@fastify/jwt'
import { FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
    interface FastifyInstance {
        authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: { id: number }
    }
}

export default fp(async (fastify) => {
    fastify.register(fastifyJwt, {
        secret: process.env.JWT_SECRET || 'supersecret',
        sign: {
            expiresIn: '7d'
        }
    })

    fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify<{ id: string }>()
        } catch {
            return reply.code(401).send({ message: 'Unauthorized action' })
        }
    })
})
