import { Prisma } from '@prisma/client'
import { AppPrismaClient } from './../../plugins/prismaPlugin.js'
import { SearchProductsRequest } from './../../schemas/product/searchProductsSchema.js'

export default async function searchProducts(
    prisma: AppPrismaClient,
    searchProductsRequest: SearchProductsRequest
) {
    const { page, itemsPerPage, search, categoryIds, minPrice, maxPrice, inStock } =
        searchProductsRequest

    const skip = (page - 1) * itemsPerPage

    const where: Prisma.ProductWhereInput = {}

    if (search && search.length > 0) {
        where.OR = [{ name: { contains: search } }, { description: { contains: search } }]
    }

    if (categoryIds.length > 0) where.categoryId = { in: categoryIds }

    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {}

        if (minPrice !== undefined) where.price.gte = minPrice
        if (maxPrice !== undefined) where.price.lte = maxPrice
    }

    if (inStock) {
        where.stock = { gt: 0 }
    }

    const [total, data] = await Promise.all([
        prisma.product.count({ where }),
        prisma.product.findMany({
            where,
            skip,
            take: itemsPerPage,
            orderBy: { id: 'asc' }
        })
    ])

    const totalPages = Math.ceil(total / itemsPerPage)

    return {
        meta: { page, itemsPerPage, total, totalPages },
        data
    }
}
