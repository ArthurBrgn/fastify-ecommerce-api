import { z } from 'zod'
import { identifierParamSchema } from '../common/identifierSchema.js'
import { productWithCategorySchema } from './../../schemas/common/productSchema.js'

const viewProductSchema = identifierParamSchema

const viewProductResponseSchema = productWithCategorySchema

type ViewProductRequest = z.infer<typeof viewProductSchema>
type ViewProductResponse = z.infer<typeof viewProductResponseSchema>

export { ViewProductRequest, ViewProductResponse, viewProductResponseSchema, viewProductSchema }
