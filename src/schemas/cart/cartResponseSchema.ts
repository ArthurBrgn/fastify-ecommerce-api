import z from 'zod'
import { identifierSchema } from '../common/identifierSchema'

const cartResponseSchema = z.object({
    items: z.array(
        z.object({
            id: identifierSchema,
            product: z.object({
                id: identifierSchema,
                name: z.string(),
                slug: z.string(),
                price: z.number()
            }),
            quantity: z.int().positive(),
            total: z.number()
        })
    ),
    total: z.number()
})

type CartResponse = z.infer<typeof cartResponseSchema>

export { CartResponse, cartResponseSchema }
