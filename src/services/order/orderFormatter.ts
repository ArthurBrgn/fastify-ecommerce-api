import { OrderResponse } from '@/schemas/order/orderSchema'
import roundPrice from '@/utils/roundPrice'
import { DiscountType } from '@prisma/client'

export type OrderWithItemsLite = {
    id: number
    total: number
    createdAt: Date
    coupon: {
        code: string
        discountType: DiscountType
        discountValue: number
    } | null
    orderItems: {
        productId: number
        quantity: number
        price: number
    }[]
}

export function formatOrder(order: OrderWithItemsLite): OrderResponse {
    return {
        id: order.id,
        total: order.total,
        createdAt: order.createdAt,
        items: order.orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: roundPrice(item.price * item.quantity)
        })),
        coupon: order.coupon
            ? {
                  code: order.coupon.code,
                  discountType: order.coupon.discountType,
                  discountValue: order.coupon.discountValue
              }
            : null
    }
}

export function formatOrders(orders: OrderWithItemsLite[]): OrderResponse[] {
    return orders.map(formatOrder)
}
