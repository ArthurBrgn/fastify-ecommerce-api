import { FastifyReply, FastifyRequest } from 'fastify'
import { getUserInfoById, loginUser, registerUser } from '../services/authService'
import type { LoginRequest, RegisterRequest } from '../schemas/authSchema'

export async function loginHandler(
    request: FastifyRequest<{ Body: LoginRequest }>,
    reply: FastifyReply
) {
    const user = await loginUser(request.server.prisma, request.body)

    const token = await reply.jwtSign({
        id: user.id
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

export async function profileHandler(request: FastifyRequest, reply: FastifyReply) {
    const user = await getUserInfoById(request.server.prisma, request.user.id)

    return reply.status(200).send(user)
}
