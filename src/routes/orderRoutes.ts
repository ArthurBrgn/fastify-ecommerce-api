import { createOrderHandler, viewOrderHandler } from '@/controllers/orderController'
import { orderResponseSchema, ViewOrderRequest, viewOrderSchema } from '@/schemas/order/orderSchema'
import { FastifyInstance } from 'fastify'

export default async function orderRoutes(server: FastifyInstance) {
    server.get<{ Params: ViewOrderRequest }>(
        '/:id',
        {
            onRequest: [server.authenticate],
            schema: {
                params: viewOrderSchema,
                response: { 200: orderResponseSchema }
            }
        },
        viewOrderHandler
    )

    server.post(
        '/',
        {
            onRequest: [server.authenticate],
            schema: { response: { 201: orderResponseSchema } }
        },
        createOrderHandler
    )
}
