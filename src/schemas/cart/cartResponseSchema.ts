import modelIdentifierSchema from '@/schemas/common/modelIdentifierSchema'
import z from 'zod'

const cartResponseSchema = z.object({
    items: z.array(
        z.object({
            productId: modelIdentifierSchema,
            name: z.string(),
            slug: z.string(),
            price: z.number(),
            quantity: z.int().positive(),
            total: z.number()
        })
    ),
    total: z.number()
})

export { cartResponseSchema }
