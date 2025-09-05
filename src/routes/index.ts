import { FastifyInstance } from 'fastify'
import authRoutes from './authRoutes'
import productRoutes from './productRoutes'

export default function routes(server: FastifyInstance) {
    server.register(authRoutes)
    server.register(productRoutes)
}
