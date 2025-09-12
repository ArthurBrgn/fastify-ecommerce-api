import {
    addProductToCartHandler,
    incrementCartItemQuantityHandler
} from '@/controllers/cartController'
import {
    AddProductToCartRequest,
    addProductToCartSchema
} from '@/schemas/cart/addProductToCartSchema'
import {
    UpdateCartItemQuantityParams,
    updateCartItemQuantityParamsSchema
} from '@/schemas/cart/updateCartItemQuantity'
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

    server.patch<{ Params: UpdateCartItemQuantityParams }>(
        '/items/:productId/increment',
        {
            onRequest: [server.authenticate],
            schema: {
                params: updateCartItemQuantityParamsSchema
            }
        },
        incrementCartItemQuantityHandler
    )
}
