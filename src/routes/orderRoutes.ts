import { createOrderHandler } from '@/controllers/orderController'
import { orderResponseSchema } from '@/schemas/order/orderResponseSchema'
import { FastifyInstance } from 'fastify'

export default async function orderRoutes(server: FastifyInstance) {
    server.post(
        '/',
        {
            onRequest: [server.authenticate],
            schema: { response: { 201: orderResponseSchema } }
        },
        createOrderHandler
    )
}
