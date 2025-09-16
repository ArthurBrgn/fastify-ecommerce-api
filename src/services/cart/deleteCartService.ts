import { RecordNotFoundException } from '@/exceptions/RecordNotFoundException'
import { AppPrismaClient } from '@/plugins/prismaPlugin'

export async function deleteCart(prisma: AppPrismaClient, cartId: number, userId: number) {
    const cart = await prisma.cart.findUnique({ where: { id: cartId, userId } })

    if (!cart) {
        throw new RecordNotFoundException('Cart not found')
    }

    await prisma.cart.delete({ where: { id: cartId } })
}
