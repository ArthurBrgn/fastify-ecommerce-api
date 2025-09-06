import { searchProductsHandler } from '@/controllers/productController'
import {
    SearchProductsRequest,
    searchProductsResponseSchema,
    searchProductsSchema
} from '@/schemas/products/searchProductsSchema'
import { FastifyInstance } from 'fastify'

export default function productRoutes(server: FastifyInstance) {
    server.get<{ Querystring: SearchProductsRequest }>(
        '/products',
        {
            onRequest: [server.authenticate],
            schema: {
                querystring: searchProductsSchema,
                response: { 200: searchProductsResponseSchema }
            }
        },
        searchProductsHandler
    )
}
