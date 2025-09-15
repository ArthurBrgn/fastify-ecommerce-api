import { CartEmptyException } from '@/exceptions/cart/CartEmptyException'
import { ProductOutOfStockException } from '@/exceptions/cart/ProductOutOfStockException'
import { RecordNotFoundException } from '@/exceptions/RecordNotFoundException'
import { AppPrismaClient } from '@/plugins/prismaPlugin'
import { OrderResponse } from '@/schemas/order/orderSchema'
import roundPrice from '@/utils/roundPrice'
import { getFormattedOrderDetailsById } from './orderService'

export default async function createOrder(
    prisma: AppPrismaClient,
    userId: number
): Promise<OrderResponse> {
    const cart = await prisma.cart.findUnique({
        where: { userId },
        select: {
            id: true,
            items: {
                select: {
                    id: true,
                    productId: true,
                    quantity: true,
                    product: {
                        select: { id: true, price: true, stock: true }
                    }
                }
            }
        }
    })

    if (!cart) {
        throw new RecordNotFoundException('Cart not found')
    }

    if (cart.items.length === 0) {
        throw new CartEmptyException()
    }

    // Check product stock for each cart item
    for (const item of cart.items) {
        if (item.quantity > item.product.stock) {
            throw new ProductOutOfStockException(`Product ${item.productId} is out of stock`)
        }
    }

    // Total order price
    const rawOrderTotal = cart.items.reduce(
        (sum, item) => sum + roundPrice(item.product.price * item.quantity),
        0
    )

    const order = await prisma.$transaction(async (tx) => {
        const createdOrder = await tx.order.create({
            data: {
                userId,
                total: rawOrderTotal
            }
        })

        await tx.orderItem.createMany({
            data: cart.items.map((item) => ({
                orderId: createdOrder.id,
                productId: item.productId,
                quantity: item.quantity,
                price: roundPrice(item.product.price)
            }))
        })

        // Decrement products stock
        for (const item of cart.items) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } }
            })
        }

        await tx.cart.delete({ where: { id: cart.id } })

        return createdOrder
    })

    return getFormattedOrderDetailsById(prisma, order.id)
}
