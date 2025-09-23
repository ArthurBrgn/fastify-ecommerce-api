import { z } from 'zod'
import { productWithCategorySchema } from './../../schemas/common/productSchema'

const popularProductsResponseSchema = z.array(productWithCategorySchema)

type PopularProductsResponse = z.infer<typeof popularProductsResponseSchema>

export { PopularProductsResponse, popularProductsResponseSchema }
