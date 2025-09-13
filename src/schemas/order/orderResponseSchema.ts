import modelIdentifierSchema from '@/schemas/common/modelIdentifierSchema'
import z from 'zod'

const orderResponseSchema = z.object({
    id: modelIdentifierSchema,
    total: z.number(),
    createdAt: z.date(),
    items: z.array(
        z.object({
            productId: modelIdentifierSchema,
            quantity: z.number(),
            price: z.number(),
            total: z.number()
        })
    )
})

type OrderResponse = z.infer<typeof orderResponseSchema>

export { OrderResponse, orderResponseSchema }
