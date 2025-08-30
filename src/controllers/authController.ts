import { FastifyReply, FastifyRequest } from 'fastify'
import { loginUser } from '../services/authService'

export async function loginHandler(
    request: FastifyRequest<{ Body: { email: string; password: string } }>,
    reply: FastifyReply
) {
    try {
        const { email, password } = request.body
        const user = await loginUser(email, password)

        const token = await reply.jwtSign({
            id: user.id,
            email: user.email,
        })

        return reply.send({ token })
    } catch {
        return reply.status(401).send({ message: 'Invalid credentials' })
    }
}

export async function registerHandler(
    request: FastifyRequest<{
        Body: { name: string; email: string; password: string; password_confirm: string }
    }>,
    reply: FastifyReply
) {
    console.log(request, reply)
}
