import { AddProductToCartRequest } from '@/schemas/cart/addProductToCartSchema'
import { UpdateCartItemQuantityParams } from '@/schemas/cart/updateCartItemQuantity'
import { addProductToCart } from '@/services/cart/addProductToCartService'
import { getCartForUser } from '@/services/cart/getUserCartService'
import { incrementCartItemQuantity } from '@/services/cart/updateCartItemQuantityService'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function addProductToCartHandler(
    request: FastifyRequest<{ Body: AddProductToCartRequest }>,
    reply: FastifyReply
) {
    await addProductToCart(request.server.prisma, request.body, request.user.id)

    const cart = await getCartForUser(request.server.prisma, request.user.id)

    return reply.status(200).send(cart)
}

export async function incrementCartItemQuantityHandler(
    request: FastifyRequest<{ Params: UpdateCartItemQuantityParams }>,
    reply: FastifyReply
) {
    await incrementCartItemQuantity(
        request.server.prisma,
        request.params.productId,
        request.user.id
    )

    const cart = await getCartForUser(request.server.prisma, request.user.id)

    return reply.status(200).send(cart)
}
