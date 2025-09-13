import { CartEmptyException } from '@/exceptions/cart/CartEmptyException'
import { ProductOutOfStockException } from '@/exceptions/cart/ProductOutOfStockException'
import { RecordNotFoundException } from '@/exceptions/RecordNotFoundException'
import { AppPrismaClient } from '@/plugins/prismaPlugin'
import { OrderResponse } from '@/schemas/order/orderResponseSchema'
import roundPrice from '@/utils/roundPrice'

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

    // Check stock for each product
    for (const item of cart.items) {
        if (item.quantity > item.product.stock) {
            throw new ProductOutOfStockException(`Product ${item.productId} is out of stock`)
        }
    }

    const rawOrderTotal = cart.items.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0
    )

    const createdOrder = await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                userId,
                total: roundPrice(rawOrderTotal)
            }
        })

        await tx.orderItem.createMany({
            data: cart.items.map((item) => ({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: roundPrice(item.product.price)
            }))
        })

        // Decrement product stock for each cartItem
        for (const item of cart.items) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } }
            })
        }

        // Delete cart
        await tx.cart.delete({ where: { id: cart.id } })

        const createdOrder = await tx.order.findUnique({
            where: { id: order.id },
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

        if (!createdOrder) {
            throw new RecordNotFoundException('Order not found')
        }

        return createdOrder
    })

    return {
        id: createdOrder.id,
        total: createdOrder.total,
        createdAt: createdOrder.createdAt,
        items: createdOrder.orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: roundPrice(item.price * item.quantity)
        }))
    }
}
