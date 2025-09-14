import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import { FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
    interface FastifyInstance {
        authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>
    }

    interface FastifyReply {
        setRefreshTokenCookie(refreshToken: string): this
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
        cookie: {
            cookieName: 'refreshToken',
            signed: false
        },
        sign: {
            expiresIn: '15m'
        }
    })

    fastify.register(fastifyCookie)

    fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify()
        } catch {
            return reply.code(401).send({ message: 'Unauthorized action' })
        }
    })

    fastify.decorateReply('setRefreshTokenCookie', function (refreshToken: string) {
        this.setCookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60
        })
        return this
    })
})
