import { FastifyReply, FastifyRequest } from 'fastify'
import { loginUser, registerUser } from '../services/authService'
import type { LoginRequest, RegisterRequest } from '../schemas/authSchema'

export async function loginHandler(
    request: FastifyRequest<{ Body: LoginRequest }>,
    reply: FastifyReply
) {
    const user = await loginUser(request.body)

    const token = await reply.jwtSign({
        id: user.id,
        email: user.email
    })

    return reply.send({ token })
}

export async function registerHandler(
    request: FastifyRequest<{ Body: RegisterRequest }>,
    reply: FastifyReply
) {
    const user = await registerUser(request.body)

    const token = await reply.jwtSign({
        id: user.id,
        email: user.email
    })

    return reply.status(201).send({ user, token })
}
