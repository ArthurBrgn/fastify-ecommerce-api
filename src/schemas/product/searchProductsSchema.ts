import { paginationMetaSchema, paginationRequestSchema } from '@/schemas/common/paginationSchema'
import { baseProductSchema } from '@/schemas/common/productSchema'
import { z } from 'zod'
import { identifierSchema } from '../common/identifierSchema'

const searchProductsSchema = paginationRequestSchema
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
    meta: paginationMetaSchema,
    data: z.array(baseProductSchema.extend({ categoryId: identifierSchema }))
})

type SearchProductsRequest = z.infer<typeof searchProductsSchema>
type SearchProductsResponse = z.infer<typeof searchProductsResponseSchema>

export {
    SearchProductsRequest,
    SearchProductsResponse,
    searchProductsResponseSchema,
    searchProductsSchema
}
