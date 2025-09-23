import { RecordNotFoundException } from './../../exceptions/RecordNotFoundException'
import { AppPrismaClient } from './../../plugins/prismaPlugin'

export async function deleteCart(prisma: AppPrismaClient, userId: number) {
    const cart = await prisma.cart.findUnique({ select: { id: true }, where: { userId } })

    if (!cart) {
        throw new RecordNotFoundException('Cart not found')
    }

    await prisma.cart.delete({ where: { id: cart.id } })
}
