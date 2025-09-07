import { RecordNotFoundException } from '@/exceptions/RecordNotFoundException'
import { AppPrismaClient } from '@/plugins/prismaPlugin'

export async function getProductDetailsById(prisma: AppPrismaClient, productId: number) {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { category: true }
    })

    if (!product) {
        throw new RecordNotFoundException('Product not found')
    }

    return product
}
