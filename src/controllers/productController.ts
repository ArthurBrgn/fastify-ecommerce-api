import { SearchProductsRequest } from '@/schemas/products/searchProductsSchema'
import { ViewProductRequest } from '@/schemas/products/viewProductSchema'
import { getProductDetailsById } from '@/services/products/productService'
import searchProducts from '@/services/products/searchProductsService'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function searchProductsHandler(
    request: FastifyRequest<{ Querystring: SearchProductsRequest }>,
    reply: FastifyReply
) {
    const paginatedProducts = await searchProducts(request.server.prisma, request.query)

    return reply.status(200).send(paginatedProducts)
}

export async function viewProductHandler(
    request: FastifyRequest<{ Params: ViewProductRequest }>,
    reply: FastifyReply
) {
    const product = await getProductDetailsById(request.server.prisma, request.params.id)

    return reply.status(200).send(product)
}
