import { z } from 'zod'
import { productWithCategorySchema } from './../../schemas/common/productSchema.js'

const popularProductsResponseSchema = z.array(productWithCategorySchema)

type PopularProductsResponse = z.infer<typeof popularProductsResponseSchema>

export { PopularProductsResponse, popularProductsResponseSchema }
