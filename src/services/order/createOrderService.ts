import { CartEmptyException } from '@/exceptions/cart/CartEmptyException'
import { ProductOutOfStockException } from '@/exceptions/cart/ProductOutOfStockException'
import { RecordNotFoundException } from '@/exceptions/RecordNotFoundException'
import { AppPrismaClient } from '@/plugins/prismaPlugin'
import { OrderResponse } from '@/schemas/order/orderSchema'
import { formatOrder } from '@/services/order/orderFormatter'
import applyCoupon from '@/utils/applyCoupon'
import roundPrice from '@/utils/roundPrice'

export default async function createOrder(
    prisma: AppPrismaClient,
    userId: number
): Promise<OrderResponse> {
    const cart = await prisma.cart.findUnique({
        where: { userId },
        select: {
            id: true,
            coupon: {
                select: {
                    id: true,
                    discountType: true,
                    discountValue: true
                }
            },
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
    let orderTotal = cart.items.reduce(
        (sum, item) => sum + roundPrice(item.product.price * item.quantity),
        0
    )

    if (cart.coupon) {
        orderTotal = applyCoupon(orderTotal, {
            discountType: cart.coupon.discountType,
            discountValue: cart.coupon.discountValue
        })
    }

    const order = await prisma.$transaction(async (tx) => {
        const createdOrder = await tx.order.create({
            data: {
                userId,
                couponId: cart.coupon?.id,
                total: orderTotal,
                orderItems: {
                    create: cart.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: roundPrice(item.product.price)
                    }))
                }
            },
            select: {
                id: true,
                total: true,
                createdAt: true,
                coupon: {
                    select: {
                        code: true,
                        discountType: true,
                        discountValue: true
                    }
                },
                orderItems: {
                    select: { productId: true, quantity: true, price: true }
                }
            }
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

    return formatOrder(order)
}
