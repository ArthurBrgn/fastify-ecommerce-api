import { SearchProductsRequest } from '@/schemas/product/searchProductsSchema'
import { ViewProductRequest } from '@/schemas/product/viewProductSchema'
import { getPopularProducts, getProductDetailsById } from '@/services/product/productService'
import searchProducts from '@/services/product/searchProductsService'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function searchProductsHandler(
    request: FastifyRequest<{ Querystring: SearchProductsRequest }>,
    reply: FastifyReply
) {
    const paginatedProducts = await searchProducts(request.server.prisma, request.query)

    return reply.send(paginatedProducts)
}

export async function getPopularProductsHandler(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id
    const products = await getPopularProducts(request.server.prisma, userId)

    return reply.send(products)
}

export async function viewProductHandler(
    request: FastifyRequest<{ Params: ViewProductRequest }>,
    reply: FastifyReply
) {
    const product = await getProductDetailsById(request.server.prisma, request.params.id)

    return reply.send(product)
}
