import authRoutes from '@/routes/authRoutes'
import productRoutes from '@/routes/productRoutes'
import { FastifyInstance } from 'fastify'
import cartRoutes from './cartRoutes'
import orderRoutes from './orderRoutes'
import userRoutes from './userRoutes'

export default function routes(server: FastifyInstance) {
    server.register(authRoutes, { prefix: '/auth' })
    server.register(productRoutes, { prefix: '/products' })
    server.register(userRoutes, { prefix: '/users' })
    server.register(cartRoutes, { prefix: '/cart' })
    server.register(orderRoutes, { prefix: '/orders' })
}
