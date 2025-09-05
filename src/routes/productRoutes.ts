import { searchProductsHandler } from 'controllers/productController'
import { FastifyInstance } from 'fastify'
import { searchProductsSchema } from 'schemas/products/searchProductsSchema'

export default function productRoutes(server: FastifyInstance) {
    server.get(
        '/products',
        {
            onRequest: [server.authenticate],
            schema: { querystring: searchProductsSchema }
        },
        searchProductsHandler
    )
}
