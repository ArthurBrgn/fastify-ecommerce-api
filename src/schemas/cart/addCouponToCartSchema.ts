import z from 'zod'

const addCouponToCartSchema = z.object({
    couponCode: z.string()
})

type AddCouponToCartRequest = z.infer<typeof addCouponToCartSchema>

export { AddCouponToCartRequest, addCouponToCartSchema }
