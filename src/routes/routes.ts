import { loginHandler } from '@/controllers/authController'
import { FastifyInstance } from 'fastify'

export default function routes(server: FastifyInstance) {
    server.post('/login', loginHandler)
}
