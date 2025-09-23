import { RecordNotFoundException } from './../../exceptions/RecordNotFoundException.js'
import { AppPrismaClient } from './../../plugins/prismaPlugin.js'

export async function deleteCartItem(prisma: AppPrismaClient, productId: number, userId: number) {
    const cart = await prisma.cart.findUnique({
        where: { userId }
    })

    if (!cart) {
        throw new RecordNotFoundException('Cart not found')
    }

    await prisma.cartItem.delete({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId: productId
            }
        }
    })
}
