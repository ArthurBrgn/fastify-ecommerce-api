import { z } from 'zod'
import { categorySchema } from './categorySchema'
import { identifierSchema } from './identifierSchema'

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

type Product = z.infer<typeof baseProductSchema>
type ProductWithCategory = z.infer<typeof productWithCategorySchema>

export { baseProductSchema, Product, ProductWithCategory, productWithCategorySchema }
