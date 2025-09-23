import { FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { CartResponse } from './../schemas/cart/cartResponseSchema.js'
import { getCartForUser } from './../services/cart/getUserCartService.js'

declare module 'fastify' {
    interface FastifyRequest {
        getUserCart: () => Promise<CartResponse>
    }
}

export default fp(async (fastify) => {
    fastify.decorateRequest('getUserCart', async function (this: FastifyRequest) {
        return getCartForUser(fastify.prisma, this.user.id)
    })
})
