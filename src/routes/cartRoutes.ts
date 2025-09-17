import {
    addCouponToCartHandler,
    addProductToCartHandler,
    decrementCartItemQuantityHandler,
    deleteCartHandler,
    deleteCartItemHandler,
    incrementCartItemQuantityHandler
} from '@/controllers/cartController'
import { AddCouponToCartRequest, addCouponToCartSchema } from '@/schemas/cart/addCouponToCartSchema'
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
                tags: ['Cart'],
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
                tags: ['Cart'],
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
                tags: ['Cart'],
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
                tags: ['Cart'],
                params: cartItemsParamsSchema,
                response: { 200: cartResponseSchema }
            }
        },
        deleteCartItemHandler
    )

    server.delete(
        '/',
        {
            onRequest: [server.authenticate],
            schema: {
                tags: ['Cart']
            }
        },
        deleteCartHandler
    )

    server.post<{ Body: AddCouponToCartRequest }>(
        '/coupon',
        {
            onRequest: [server.authenticate],
            schema: {
                tags: ['Cart'],
                body: addCouponToCartSchema,
                response: {
                    200: cartResponseSchema
                }
            }
        },
        addCouponToCartHandler
    )
}
