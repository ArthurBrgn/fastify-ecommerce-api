import {
    getTopProductsHandler,
    searchProductsHandler,
    viewProductHandler
} from '@/controllers/productController'
import { paginatedProductsResponseSchema } from '@/schemas/common/productSchema'
import { SearchProductsRequest, searchProductsSchema } from '@/schemas/product/searchProductsSchema'
import { topProductsResponseSchema } from '@/schemas/product/topProductsSchema'
import {
    ViewProductRequest,
    viewProductResponseSchema,
    viewProductSchema
} from '@/schemas/product/viewProductSchema'
import { FastifyInstance } from 'fastify'

export default function productRoutes(server: FastifyInstance) {
    server.get<{ Querystring: SearchProductsRequest }>(
        '/',
        {
            onRequest: [server.authenticate],
            schema: {
                tags: ['Product'],
                querystring: searchProductsSchema,
                response: { 200: paginatedProductsResponseSchema }
            }
        },
        searchProductsHandler
    )

    server.get(
        '/top',
        {
            onRequest: [server.authenticate],
            schema: {
                tags: ['Product'],
                response: { 200: topProductsResponseSchema }
            }
        },
        getTopProductsHandler
    )

    server.get<{ Params: ViewProductRequest }>(
        '/:id',
        {
            onRequest: [server.authenticate],
            schema: {
                tags: ['Product'],
                params: viewProductSchema,
                response: { 200: viewProductResponseSchema }
            }
        },
        viewProductHandler
    )
}
