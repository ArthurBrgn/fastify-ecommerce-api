import { productWithCategorySchema } from '@/schemas/common/productSchema'
import { z } from 'zod'

const viewProductSchema = z.object({
    id: z.coerce.number().int().positive().meta({ example: 1 })
})

const viewProductResponseSchema = productWithCategorySchema

type ViewProductRequest = z.infer<typeof viewProductSchema>
type ViewProductResponse = z.infer<typeof viewProductResponseSchema>

export { ViewProductRequest, ViewProductResponse, viewProductResponseSchema, viewProductSchema }
