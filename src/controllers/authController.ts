import type { LoginRequest, RegisterRequest } from '@/schemas/authSchema'
import { loginUser, registerUser } from '@/services/authService'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function loginHandler(
    request: FastifyRequest<{ Body: LoginRequest }>,
    reply: FastifyReply
) {
    const userId = await loginUser(request.server.prisma, request.body)

    const token = await reply.jwtSign({
        id: userId
    })

    return reply.send({ token })
}

export async function registerHandler(
    request: FastifyRequest<{ Body: RegisterRequest }>,
    reply: FastifyReply
) {
    const user = await registerUser(request.server.prisma, request.body)

    const token = await reply.jwtSign({
        id: user.id
    })

    return reply.status(201).send({ user, token })
}
