import { z } from 'zod'
import { categorySchema } from './categorySchema'
import modeldentifierSchema from './modeldentifierSchema'

export const baseProductSchema = z.object({
    id: modeldentifierSchema,
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    price: z.number(),
    stock: z.number().int().meta({ example: 25 }),
    createdAt: z.date()
})

export const productWithCategorySchema = baseProductSchema.extend({
    category: categorySchema
})

export type Product = z.infer<typeof baseProductSchema>
export type ProductWithCategory = z.infer<typeof productWithCategorySchema>
