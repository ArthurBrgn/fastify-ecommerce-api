import { productWithCategorySchema } from '@/schemas/common/productSchema'
import { z } from 'zod'

const topProductsResponseSchema = z.array(productWithCategorySchema)

type TopProductsResponse = z.infer<typeof topProductsResponseSchema>

export { TopProductsResponse, topProductsResponseSchema }
