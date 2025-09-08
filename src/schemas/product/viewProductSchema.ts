import { productWithCategorySchema } from '@/schemas/common/productSchema'
import { z } from 'zod'

export const viewProductSchema = z.object({
    id: z.coerce.number().int().positive().meta({ example: 1 })
})

export const viewProductResponseSchema = productWithCategorySchema

export type ViewProductRequest = z.infer<typeof viewProductSchema>
export type ViewProductResponse = z.infer<typeof viewProductResponseSchema>
