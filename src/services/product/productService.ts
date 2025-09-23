import { RecordNotFoundException } from './../../exceptions/RecordNotFoundException'
import { AppPrismaClient } from './../../plugins/prismaPlugin'

export async function getPopularProducts(prisma: AppPrismaClient, userId: number) {
    const popularProducts = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        where: { order: { userId } },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10
    })

    if (popularProducts.length === 0) {
        return []
    }

    const productIds = popularProducts.map((p) => p.productId)

    const productsWithCategory = await prisma.product.findMany({
        where: { id: { in: productIds } },
        include: { category: true }
    })

    // Sort products to preserve order
    const orderedProducts = productsWithCategory.sort(
        (a, b) => productIds.indexOf(a.id) - productIds.indexOf(b.id)
    )

    return orderedProducts
}

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
