import z from 'zod'
import { identifierSchema } from '../common/identifierSchema'

const cartItemsParamsSchema = z.object({
    productId: z.coerce.number().pipe(identifierSchema)
})

type CartItemParamsSchema = z.infer<typeof cartItemsParamsSchema>

export { CartItemParamsSchema, cartItemsParamsSchema }
