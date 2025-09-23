import { RecordNotFoundException } from './../../exceptions/RecordNotFoundException.js'
import { AppPrismaClient } from './../../plugins/prismaPlugin.js'

export async function deleteCouponFromCart(prisma: AppPrismaClient, userId: number) {
    const cart = await prisma.cart.findUnique({
        where: { userId }
    })

    if (!cart) {
        throw new RecordNotFoundException('Cart not found')
    }

    await prisma.cart.update({
        where: { userId },
        data: {
            couponId: null
        }
    })
}
