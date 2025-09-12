import { ProductOutOfStockException } from '@/exceptions/cart/ProductOutOfStockException'
import { RecordNotFoundException } from '@/exceptions/RecordNotFoundException'
import { AppPrismaClient } from '@/plugins/prismaPlugin'

export async function incrementCartItemQuantity(
    prisma: AppPrismaClient,
    productId: number,
    userId: number
) {
    const cart = await prisma.cart.findUnique({
        where: { userId }
    })

    if (!cart) {
        throw new RecordNotFoundException('Cart not found')
    }

    const cartItem = await prisma.cartItem.findUnique({
        where: {
            cartId_productId: { cartId: cart.id, productId }
        },
        include: { product: true }
    })

    if (!cartItem) {
        throw new RecordNotFoundException('Product not in cart')
    }

    if (cartItem.product.stock < cartItem.quantity + 1) {
        throw new ProductOutOfStockException(`Not enough stock`)
    }

    await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: { increment: 1 } }
    })
}

export async function decrementCartItemQuantity(
    prisma: AppPrismaClient,
    productId: number,
    userId: number
) {
    const cart = await prisma.cart.findUnique({ where: { userId } })

    if (!cart) {
        throw new RecordNotFoundException('Cart not found')
    }

    const cartItem = await prisma.cartItem.findUnique({
        where: { cartId_productId: { cartId: cart.id, productId } },
        include: { product: true }
    })

    if (!cartItem) {
        throw new RecordNotFoundException('Product not in cart')
    }

    if (cartItem.quantity <= 1) {
        await prisma.cartItem.delete({ where: { id: cartItem.id } })

        return
    }

    await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: { decrement: 1 } }
    })
}
