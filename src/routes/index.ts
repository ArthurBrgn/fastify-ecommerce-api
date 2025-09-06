import authRoutes from '@/routes/authRoutes'
import productRoutes from '@/routes/productRoutes'
import { FastifyInstance } from 'fastify'

export default function routes(server: FastifyInstance) {
    server.register(authRoutes)
    server.register(productRoutes)
}
