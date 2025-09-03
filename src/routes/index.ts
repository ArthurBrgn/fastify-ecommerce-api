import { FastifyInstance } from 'fastify'
import authRoutes from './authRoutes'

export default function routes(server: FastifyInstance) {
    server.register(authRoutes)
}
