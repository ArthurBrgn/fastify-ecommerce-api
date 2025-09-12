import z from 'zod'

const cartItemsParamsSchema = z.object({
    productId: z.coerce.number().int().positive().meta({ example: 1 })
})

type CartItemParamsSchema = z.infer<typeof cartItemsParamsSchema>

export { CartItemParamsSchema, cartItemsParamsSchema }
