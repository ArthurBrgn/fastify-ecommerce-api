import { RecordNotFoundException } from '@/exceptions/RecordNotFoundException'
import { AppPrismaClient } from '@/plugins/prismaPlugin'
import { PaginationRequest } from '@/schemas/common/paginationSchema'
import { OrderResponse } from '@/schemas/order/orderSchema'
import { formatOrder, formatOrders } from '@/services/order/orderFormatter'

export async function getOrderDetails(
    prisma: AppPrismaClient,
    orderId: number
): Promise<OrderResponse> {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
            id: true,
            total: true,
            createdAt: true,
            orderItems: {
                select: {
                    productId: true,
                    quantity: true,
                    price: true
                }
            },
            coupon: {
                select: {
                    code: true,
                    discountType: true,
                    discountValue: true
                }
            }
        }
    })

    if (!order) {
        throw new RecordNotFoundException('Order not found')
    }

    return formatOrder(order)
}

export async function getOrdersHistory(
    prisma: AppPrismaClient,
    userId: number,
    filters: PaginationRequest
) {
    const page = filters.page
    const itemsPerPage = filters.itemsPerPage

    const skip = (page - 1) * itemsPerPage

    const [orders, totalItems] = await Promise.all([
        prisma.order.findMany({
            where: { userId: userId },
            select: {
                id: true,
                total: true,
                createdAt: true,
                orderItems: {
                    select: { productId: true, quantity: true, price: true }
                },
                coupon: {
                    select: {
                        code: true,
                        discountType: true,
                        discountValue: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip: skip,
            take: itemsPerPage
        }),
        prisma.order.count({ where: { userId: userId } })
    ])

    return {
        data: formatOrders(orders),
        meta: {
            page,
            itemsPerPage,
            total: totalItems,
            totalPages: Math.ceil(totalItems / itemsPerPage)
        }
    }
}
