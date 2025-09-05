import { z } from 'zod'
import paginatorSchema from 'schemas/common/paginatorSchema'

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

type SearchProductsRequest = z.infer<typeof searchProductsSchema>

export { searchProductsSchema, SearchProductsRequest }
