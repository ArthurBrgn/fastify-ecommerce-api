import { ProductOutOfStockException } from '@/exceptions/cart/ProductOutOfStockException'
import { RecordNotFoundException } from '@/exceptions/RecordNotFoundException'
import { AppPrismaClient } from '@/plugins/prismaPlugin'
import { AddProductToCartRequest } from '@/schemas/cart/addProductToCartSchema'

export async function addProductToCart(
    prisma: AppPrismaClient,
    productData: AddProductToCartRequest,
    userId: number
) {
    const { productId, quantity } = productData

    const product = await prisma.product.findUnique({ where: { id: productId } })

    if (!product) {
        throw new RecordNotFoundException('Product not found')
    }

    if (product.stock < quantity) {
        throw new ProductOutOfStockException(
            `Requested quantity exceeds available stock. Available stock: ${product.stock}.`
        )
    }

    let cart = await prisma.cart.findUnique({
        where: { userId },
        include: { items: true }
    })

    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId },
            include: { items: true }
        })
    }

    await prisma.cartItem.upsert({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId
            }
        },
        update: {
            quantity: { increment: quantity }
        },
        create: {
            cartId: cart.id,
            productId,
            quantity
        }
    })
}
