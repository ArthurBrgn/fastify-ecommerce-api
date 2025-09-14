import type { LoginRequest, RegisterRequest } from '@/schemas/authSchema'
import { loginUser, registerUser } from '@/services/authService'
import { FastifyReply, FastifyRequest } from 'fastify'

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
