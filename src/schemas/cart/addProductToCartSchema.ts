import z from 'zod'
import { identifierSchema } from '../common/identifierSchema'

const addProductToCartSchema = z.object({
    productId: identifierSchema,
    quantity: z.int().positive()
})

type AddProductToCartRequest = z.infer<typeof addProductToCartSchema>

export { AddProductToCartRequest, addProductToCartSchema }
