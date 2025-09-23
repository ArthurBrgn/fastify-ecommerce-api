import { FastifyReply, FastifyRequest } from 'fastify'
import { AddCouponToCartRequest } from './../schemas/cart/addCouponToCartSchema.js'
import { AddProductToCartRequest } from './../schemas/cart/addProductToCartSchema.js'
import { CartItemParamsSchema } from './../schemas/cart/cartItemParamsSchema.js'
import addCouponToCart from './../services/cart/addCouponToCartService.js'
import { addProductToCart } from './../services/cart/addProductToCartService.js'
import { deleteCartItem } from './../services/cart/deleteCartItemService.js'
import { deleteCart } from './../services/cart/deleteCartService.js'
import { deleteCouponFromCart } from './../services/cart/deleteCouponFromCartService.js'
import {
    decrementCartItemQuantity,
    incrementCartItemQuantity
} from './../services/cart/updateCartItemQuantityService.js'

export async function addProductToCartHandler(
    request: FastifyRequest<{ Body: AddProductToCartRequest }>,
    reply: FastifyReply
) {
    await addProductToCart(request.server.prisma, request.body, request.user.id)

    const cart = await request.getUserCart()

    return reply.send(cart)
}

export async function incrementCartItemQuantityHandler(
    request: FastifyRequest<{ Params: CartItemParamsSchema }>,
    reply: FastifyReply
) {
    await incrementCartItemQuantity(
        request.server.prisma,
        request.params.productId,
        request.user.id
    )

    const cart = await request.getUserCart()

    return reply.send(cart)
}

export async function decrementCartItemQuantityHandler(
    request: FastifyRequest<{ Params: CartItemParamsSchema }>,
    reply: FastifyReply
) {
    await decrementCartItemQuantity(
        request.server.prisma,
        request.params.productId,
        request.user.id
    )

    const cart = await request.getUserCart()

    return reply.send(cart)
}

export async function deleteCartItemHandler(
    request: FastifyRequest<{ Params: CartItemParamsSchema }>,
    reply: FastifyReply
) {
    await deleteCartItem(request.server.prisma, request.params.productId, request.user.id)

    const cart = await request.getUserCart()

    return reply.send(cart)
}

export async function deleteCartHandler(request: FastifyRequest, reply: FastifyReply) {
    await deleteCart(request.server.prisma, request.user.id)

    return reply.status(204).send()
}

export async function addCouponToCartHandler(
    request: FastifyRequest<{ Body: AddCouponToCartRequest }>,
    reply: FastifyReply
) {
    await addCouponToCart(request.server.prisma, request.body.couponCode, request.user.id)

    const cart = await request.getUserCart()

    return reply.send(cart)
}

export async function deleteCouponFromCartHandler(request: FastifyRequest, reply: FastifyReply) {
    await deleteCouponFromCart(request.server.prisma, request.user.id)

    return reply.status(204).send()
}
