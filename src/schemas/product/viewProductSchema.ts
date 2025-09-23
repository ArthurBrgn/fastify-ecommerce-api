import { z } from 'zod'
import { identifierParamSchema } from '../common/identifierSchema'
import { productWithCategorySchema } from './../../schemas/common/productSchema'

const viewProductSchema = identifierParamSchema

const viewProductResponseSchema = productWithCategorySchema

type ViewProductRequest = z.infer<typeof viewProductSchema>
type ViewProductResponse = z.infer<typeof viewProductResponseSchema>

export { ViewProductRequest, ViewProductResponse, viewProductResponseSchema, viewProductSchema }
