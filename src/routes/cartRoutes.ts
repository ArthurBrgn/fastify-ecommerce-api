import {
    addProductToCartHandler,
    decrementCartItemQuantityHandler,
    deleteCartItemHandler,
    incrementCartItemQuantityHandler
} from '@/controllers/cartController'
import {
    AddProductToCartRequest,
    addProductToCartSchema
} from '@/schemas/cart/addProductToCartSchema'
import { CartItemParamsSchema, cartItemsParamsSchema } from '@/schemas/cart/cartItemParamsSchema'
import { cartResponseSchema } from '@/schemas/cart/cartResponseSchema'
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

    server.patch<{ Params: CartItemParamsSchema }>(
        '/items/:productId/increment',
        {
            onRequest: [server.authenticate],
            schema: {
                params: cartItemsParamsSchema,
                response: { 200: cartResponseSchema }
            }
        },
        incrementCartItemQuantityHandler
    )

    server.patch<{ Params: CartItemParamsSchema }>(
        '/items/:productId/decrement',
        {
            onRequest: [server.authenticate],
            schema: {
                params: cartItemsParamsSchema,
                response: { 200: cartResponseSchema }
            }
        },
        decrementCartItemQuantityHandler
    )

    server.delete<{ Params: CartItemParamsSchema }>(
        '/items/:productId',
        {
            onRequest: [server.authenticate],
            schema: {
                params: cartItemsParamsSchema,
                response: { 200: cartResponseSchema }
            }
        },
        deleteCartItemHandler
    )
}
