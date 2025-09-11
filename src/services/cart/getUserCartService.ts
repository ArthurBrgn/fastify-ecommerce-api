import { AppPrismaClient } from '@/plugins/prismaPlugin'

export async function getCartForUser(prisma: AppPrismaClient, userId: number) {
    const cart = await prisma.cart.findUnique({
        where: { userId },
        select: {
            items: {
                select: {
                    id: true,
                    productId: true,
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

    const formattedCart = {
        items: cart.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            name: item.product.name,
            slug: item.product.slug,
            price: item.product.price,
            quantity: item.quantity,
            total: Number((item.product.price * item.quantity).toFixed(2))
        })),
        total: Number(
            cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0).toFixed(2)
        )
    }

    return formattedCart
}
