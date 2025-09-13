import modelIdentifierSchema from '@/schemas/common/modelIdentifierSchema'
import z from 'zod'

const cartResponseSchema = z.object({
    items: z.array(
        z.object({
            id: modelIdentifierSchema,
            product: z.object({
                id: modelIdentifierSchema,
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
