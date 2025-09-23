import { FastifyInstance } from 'fastify'
import authRoutes from './../routes/authRoutes.js'
import productRoutes from './../routes/productRoutes.js'
import cartRoutes from './cartRoutes.js'
import orderRoutes from './orderRoutes.js'
import userRoutes from './userRoutes.js'

export default function routes(server: FastifyInstance) {
    server.register(authRoutes, { prefix: '/auth' })
    server.register(productRoutes, { prefix: '/products' })
    server.register(userRoutes, { prefix: '/users' })
    server.register(cartRoutes, { prefix: '/cart' })
    server.register(orderRoutes, { prefix: '/orders' })
}
