import { ViewOrderRequest } from '@/schemas/order/orderSchema'
import createOrder from '@/services/order/createOrderService'
import getOrderDetails from '@/services/order/orderService'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function viewOrderHandler(
    request: FastifyRequest<{ Params: ViewOrderRequest }>,
    reply: FastifyReply
) {
    const order = await getOrderDetails(request.server.prisma, request.params.id)

    return reply.status(200).send(order)
}

export async function createOrderHandler(request: FastifyRequest, reply: FastifyReply) {
    const order = await createOrder(request.server.prisma, request.user.id)

    return reply.status(201).send(order)
}
