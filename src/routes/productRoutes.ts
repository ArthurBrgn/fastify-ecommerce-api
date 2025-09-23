import { FastifyInstance } from 'fastify'
import {
    getPopularProductsHandler,
    searchProductsHandler,
    viewProductHandler
} from './../controllers/productController.js'
import { paginatedProductsResponseSchema } from './../schemas/common/productSchema.js'
import { popularProductsResponseSchema } from './../schemas/product/popularProductsSchema.js'
import {
    SearchProductsRequest,
    searchProductsSchema
} from './../schemas/product/searchProductsSchema.js'
import {
    ViewProductRequest,
    viewProductResponseSchema,
    viewProductSchema
} from './../schemas/product/viewProductSchema.js'

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
        '/popular',
        {
            onRequest: [server.authenticate],
            schema: {
                tags: ['Product'],
                response: { 200: popularProductsResponseSchema }
            }
        },
        getPopularProductsHandler
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
