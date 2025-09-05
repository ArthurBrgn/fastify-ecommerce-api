import { searchProductsHandler } from './../controllers/productController'
import { FastifyInstance } from 'fastify'
import {
    SearchProductsRequest,
    searchProductsResponseSchema,
    searchProductsSchema
} from './../schemas/products/searchProductsSchema'

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
