import createOrder from '@/services/order/createOrderService'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function createOrderHandler(request: FastifyRequest, reply: FastifyReply) {
    const order = await createOrder(request.server.prisma, request.user.id)

    return reply.status(201).send(order)
}
