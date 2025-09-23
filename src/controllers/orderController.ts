import { FastifyReply, FastifyRequest } from 'fastify'
import { PaginationRequest } from './../schemas/common/paginationSchema'
import { ViewOrderRequest } from './../schemas/order/orderSchema'
import createOrder from './../services/order/createOrderService'
import { getOrderDetails, getOrdersHistory } from './../services/order/orderService'

export async function getOrdersHistoryHandler(
    request: FastifyRequest<{ Querystring: PaginationRequest }>,
    reply: FastifyReply
) {
    const order = await getOrdersHistory(request.server.prisma, request.user.id, request.query)

    return reply.send(order)
}

export async function viewOrderHandler(
    request: FastifyRequest<{ Params: ViewOrderRequest }>,
    reply: FastifyReply
) {
    const order = await getOrderDetails(request.server.prisma, request.params.id)

    return reply.send(order)
}

export async function createOrderHandler(request: FastifyRequest, reply: FastifyReply) {
    const order = await createOrder(request.server.prisma, request.user.id)

    return reply.code(201).send(order)
}
