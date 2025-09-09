import authRoutes from '@/routes/authRoutes'
import productRoutes from '@/routes/productRoutes'
import { FastifyInstance } from 'fastify'
import userRoutes from './userRoutes'

export default function routes(server: FastifyInstance) {
    server.register(authRoutes)
    server.register(productRoutes, { prefix: '/products' })
    server.register(userRoutes, { prefix: '/users' })
}
