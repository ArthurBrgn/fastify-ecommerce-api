import { AddProductToCartRequest } from '@/schemas/cart/addProductToCartSchema'
import { addProductToCart } from '@/services/cart/addProductToCartService'
import { getCartForUser } from '@/services/cart/getUserCartService'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function addProductToCartHandler(
    request: FastifyRequest<{ Body: AddProductToCartRequest }>,
    reply: FastifyReply
) {
    await addProductToCart(request.server.prisma, request.body, request.user.id)

    const cart = await getCartForUser(request.server.prisma, request.user.id)

    return reply.status(200).send(cart)
}
