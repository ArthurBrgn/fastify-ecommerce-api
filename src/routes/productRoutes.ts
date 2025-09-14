import { searchProductsHandler, viewProductHandler } from '@/controllers/productController'
import {
    SearchProductsRequest,
    searchProductsResponseSchema,
    searchProductsSchema
} from '@/schemas/product/searchProductsSchema'
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
                response: { 200: searchProductsResponseSchema }
            }
        },
        searchProductsHandler
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
