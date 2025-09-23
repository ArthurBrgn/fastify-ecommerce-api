import { FastifyReply, FastifyRequest } from 'fastify'
import type { LoginRequest, RegisterRequest } from './../schemas/authSchema'
import { loginUser, registerUser } from './../services/authService'

export async function loginHandler(
    request: FastifyRequest<{ Body: LoginRequest }>,
    reply: FastifyReply
) {
    const userId = await loginUser(request.server.prisma, request.body)

    const accessToken = await reply.jwtSign({ id: userId })
    const refreshToken = await reply.jwtSign({ id: userId }, { expiresIn: '7d' })

    return reply.setRefreshTokenCookie(refreshToken).send({ accessToken })
}

export async function registerHandler(
    request: FastifyRequest<{ Body: RegisterRequest }>,
    reply: FastifyReply
) {
    const user = await registerUser(request.server.prisma, request.body)

    const accessToken = await reply.jwtSign({ id: user.id })
    const refreshToken = await reply.jwtSign({ id: user.id }, { expiresIn: '7d' })

    return reply.code(201).setRefreshTokenCookie(refreshToken).send({ user, accessToken })
}

export async function refreshAccessTokenHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify({ onlyCookie: true })
    } catch {
        return reply.code(401).send({ message: 'Unauthorized action' })
    }

    const accessToken = await reply.jwtSign({ id: request.user.id })

    return reply.send({ accessToken })
}
