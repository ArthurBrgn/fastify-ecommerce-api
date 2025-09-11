import { addProductToCartHandler } from '@/controllers/cartController'
import {
    AddProductToCartRequest,
    addProductToCartSchema
} from '@/schemas/cart/addProductToCartSchema'
import { cartResponseSchema } from '@/schemas/common/cartSchema'
import { FastifyInstance } from 'fastify'

export default function cartRoutes(server: FastifyInstance) {
    server.post<{ Body: AddProductToCartRequest }>(
        '/items',
        {
            onRequest: [server.authenticate],
            schema: {
                body: addProductToCartSchema,
                response: {
                    200: cartResponseSchema
                }
            }
        },
        addProductToCartHandler
    )
}
