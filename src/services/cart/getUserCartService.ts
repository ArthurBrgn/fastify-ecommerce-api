import { AppPrismaClient } from '@/plugins/prismaPlugin'
import { CartResponse } from '@/schemas/cart/cartResponseSchema'
import roundPrice from '@/utils/roundPrice'

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
            }
        }
    })

    if (!cart) {
        return { items: [], total: 0 }
    }

    const items = cart.items.map((item) => {
        return {
            ...item,
            total: roundPrice(item.product.price * item.quantity)
        }
    })

    const total = roundPrice(items.reduce((sum, item) => sum + item.total, 0))

    return { items, total }
}
