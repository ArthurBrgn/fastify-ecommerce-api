import {
    createOrderHandler,
    getOrdersHistoryHandler,
    viewOrderHandler
} from '@/controllers/orderController'
import { PaginationRequest, paginationRequestSchema } from '@/schemas/common/paginationSchema'
import { orderResponseSchema, ViewOrderRequest, viewOrderSchema } from '@/schemas/order/orderSchema'
import { FastifyInstance } from 'fastify'

export default async function orderRoutes(server: FastifyInstance) {
    server.get<{ Params: PaginationRequest }>(
        '/',
        {
            onRequest: [server.authenticate],
            schema: {
                tags: ['Order'],
                params: paginationRequestSchema
            }
        },
        getOrdersHistoryHandler
    )

    server.get<{ Params: ViewOrderRequest }>(
        '/:id',
        {
            onRequest: [server.authenticate],
            schema: {
                tags: ['Order'],
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
            schema: {
                tags: ['Order'],
                response: { 201: orderResponseSchema }
            }
        },
        createOrderHandler
    )
}
