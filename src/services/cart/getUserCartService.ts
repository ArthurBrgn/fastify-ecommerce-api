import { AppPrismaClient } from './../../plugins/prismaPlugin'
import { CartResponse } from './../../schemas/cart/cartResponseSchema'
import applyCoupon from './../../utils/applyCoupon'
import roundPrice from './../../utils/roundPrice'

export async function getCartForUser(
    prisma: AppPrismaClient,
    userId: number
): Promise<CartResponse> {
    const cart = await prisma.cart.findUnique({
        where: { userId },
        select: {
            items: {
                select: {
                    id: true,
                    quantity: true,
                    product: {
                        select: { id: true, name: true, price: true, slug: true }
                    }
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

    if (!cart || cart.items.length === 0) {
        return { items: [], total: 0 }
    }

    const items = cart.items.map((item) => {
        return {
            ...item,
            total: roundPrice(item.product.price * item.quantity)
        }
    })

    let total = roundPrice(items.reduce((sum, item) => sum + item.total, 0))

    if (cart.coupon) {
        total = applyCoupon(total, cart.coupon)
    }

    return { items, total }
}
