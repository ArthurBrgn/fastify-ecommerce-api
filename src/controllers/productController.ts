import { FastifyReply, FastifyRequest } from 'fastify'
import { SearchProductsRequest } from './../schemas/products/searchProductsSchema'
import { searchProducts } from './../services/productService'

export async function searchProductsHandler(
    request: FastifyRequest<{ Querystring: SearchProductsRequest }>,
    reply: FastifyReply
) {
    const paginatedProducts = await searchProducts(request.server.prisma, request.query)

    return reply.status(200).send(paginatedProducts)
}
