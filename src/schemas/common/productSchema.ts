import { z } from 'zod'
import { categorySchema } from './categorySchema.js'
import { identifierSchema } from './identifierSchema.js'
import { paginationMetaSchema } from './paginationSchema.js'

const baseProductSchema = z.object({
    id: identifierSchema,
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    price: z.number(),
    stock: z.int().meta({ example: 25 }),
    createdAt: z.date()
})

const productWithCategorySchema = baseProductSchema.extend({
    category: categorySchema
})

const paginatedProductsResponseSchema = z.object({
    meta: paginationMetaSchema,
    data: z.array(baseProductSchema.extend({ categoryId: identifierSchema }))
})

type Product = z.infer<typeof baseProductSchema>
type ProductWithCategory = z.infer<typeof productWithCategorySchema>

type PaginatedProductsResponse = z.infer<typeof paginatedProductsResponseSchema>

export {
    baseProductSchema,
    PaginatedProductsResponse,
    paginatedProductsResponseSchema,
    Product,
    ProductWithCategory,
    productWithCategorySchema
}
