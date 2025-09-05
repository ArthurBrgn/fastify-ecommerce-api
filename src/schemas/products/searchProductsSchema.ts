import { z } from 'zod'
import paginatorSchema from './../common/paginatorSchema'

const searchProductsSchema = paginatorSchema
    .extend({
        search: z.string().trim().min(1).optional(),
        categoryIds: z.array(z.coerce.number().int()).default([]),
        minPrice: z.coerce.number().min(0).optional(),
        maxPrice: z.coerce.number().min(0).optional(),
        inStock: z.coerce.boolean().optional()
    })
    .refine(
        (data) =>
            data.minPrice === undefined ||
            data.maxPrice === undefined ||
            data.maxPrice >= data.minPrice,
        {
            message: 'maxPrice must be greater than or equal to minPrice',
            path: ['priceMax']
        }
    )

const searchProductsResponseSchema = z.object({
    meta: z.object({
        page: z.number().int(),
        itemsPerPage: z.number().int(),
        total: z.number().int(),
        totalPages: z.number().int()
    }),
    data: z.array(
        z.object({
            id: z.number().int(),
            name: z.string(),
            slug: z.string(),
            description: z.nullable(z.string()),
            price: z.number(),
            stock: z.number().int(),
            categoryId: z.number().int(),
            createdAt: z.date()
        })
    )
})

type SearchProductsRequest = z.infer<typeof searchProductsSchema>
type SearchProductsResponse = z.infer<typeof searchProductsResponseSchema>

export {
    searchProductsSchema,
    SearchProductsRequest,
    searchProductsResponseSchema,
    SearchProductsResponse
}
