import z from 'zod'
import modelIdentifierSchema from '../common/modelIdentifierSchema'

const addProductToCartSchema = z.object({
    productId: modelIdentifierSchema,
    quantity: z.int().positive()
})

type AddProductToCartRequest = z.infer<typeof addProductToCartSchema>

export { AddProductToCartRequest, addProductToCartSchema }
