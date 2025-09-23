import { FastifyReply, FastifyRequest } from 'fastify'
import { AddCouponToCartRequest } from './../schemas/cart/addCouponToCartSchema'
import { AddProductToCartRequest } from './../schemas/cart/addProductToCartSchema'
import { CartItemParamsSchema } from './../schemas/cart/cartItemParamsSchema'
import addCouponToCart from './../services/cart/addCouponToCartService'
import { addProductToCart } from './../services/cart/addProductToCartService'
import { deleteCartItem } from './../services/cart/deleteCartItemService'
import { deleteCart } from './../services/cart/deleteCartService'
import { deleteCouponFromCart } from './../services/cart/deleteCouponFromCartService'
import {
    decrementCartItemQuantity,
    incrementCartItemQuantity
} from './../services/cart/updateCartItemQuantityService'

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
