import { FastifyReply, FastifyRequest } from 'fastify'
import { loginUser, registerUser } from '../services/authService'
import type { LoginRequest, RegisterRequest } from '../schemas/authSchema'

export async function loginHandler(
    request: FastifyRequest<{ Body: LoginRequest }>,
    reply: FastifyReply
) {
    try {
        const user = await loginUser(request.body)

        const token = await reply.jwtSign({
            id: user.id,
            email: user.email
        })

        return reply.send({ token })
    } catch {
        return reply.status(401).send({ message: 'Invalid credentials' })
    }
}

export async function registerHandler(
    request: FastifyRequest<{ Body: RegisterRequest }>,
    reply: FastifyReply
) {
    try {
        const user = await registerUser(request.body)

        const token = await reply.jwtSign({
            id: user.id,
            email: user.email
        })

        return reply.send({ token })
    } catch {
        return reply.status(401).send({ message: 'Invalid credentials' })
    }
}
