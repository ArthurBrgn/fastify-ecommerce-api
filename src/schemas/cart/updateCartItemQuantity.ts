import z from 'zod'

const updateCartItemQuantityParamsSchema = z.object({
    productId: z.coerce.number().int().positive().meta({ example: 1 })
})

type UpdateCartItemQuantityParams = z.infer<typeof updateCartItemQuantityParamsSchema>

export { UpdateCartItemQuantityParams, updateCartItemQuantityParamsSchema }
