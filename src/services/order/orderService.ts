import { RecordNotFoundException } from '@/exceptions/RecordNotFoundException'
import { AppPrismaClient } from '@/plugins/prismaPlugin'
import { OrderResponse } from '@/schemas/order/orderSchema'
import roundPrice from '@/utils/roundPrice'

export default async function getFormattedOrderDetailsById(
    prisma: AppPrismaClient,
    orderId: number
): Promise<OrderResponse> {
    // Get order with items
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
            }
        }
    })

    if (!order) {
        throw new RecordNotFoundException('Order not found')
    }

    return {
        id: order.id,
        total: order.total,
        createdAt: order.createdAt,
        items: order.orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: roundPrice(item.price * item.quantity)
        }))
    }
}
