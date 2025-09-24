import z from 'zod'
import { identifierParamSchema, identifierSchema } from '../common/identifierSchema.js'
import { DiscountType } from './../../generated/prisma/enums.js'

const viewOrderSchema = identifierParamSchema

const orderResponseSchema = z.object({
    id: identifierSchema,
    total: z.number(),
    createdAt: z.date(),
    items: z.array(
        z.object({
            productId: identifierSchema,
            quantity: z.number(),
            price: z.number(),
            total: z.number()
        })
    ),
    coupon: z
        .object({
            code: z.string(),
            discountType: z.enum(DiscountType),
            discountValue: z.number().positive()
        })
        .nullable()
})

type ViewOrderRequest = z.infer<typeof viewOrderSchema>
type OrderResponse = z.infer<typeof orderResponseSchema>

export { OrderResponse, orderResponseSchema, ViewOrderRequest, viewOrderSchema }
