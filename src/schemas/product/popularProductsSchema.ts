import { productWithCategorySchema } from '@/schemas/common/productSchema'
import { z } from 'zod'

const popularProductsResponseSchema = z.array(productWithCategorySchema)

type PopularProductsResponse = z.infer<typeof popularProductsResponseSchema>

export { PopularProductsResponse, popularProductsResponseSchema }
