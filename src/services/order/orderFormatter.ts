import { OrderResponse } from '@/schemas/order/orderSchema'
import roundPrice from '@/utils/roundPrice'

export type OrderWithItemsLite = {
    id: number
    total: number
    createdAt: Date
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
        }))
    }
}

export function formatOrders(orders: OrderWithItemsLite[]): OrderResponse[] {
    return orders.map(formatOrder)
}
