import { DiscountType } from '@prisma/client'

export default function applyCoupon(
    total: number,
    coupon?: { discountType: DiscountType; discountValue: number }
) {
    if (!coupon) return total

    if (coupon.discountType === DiscountType.FIXED) {
        return Math.max(total - coupon.discountValue, 0)
    } else if (coupon.discountType === DiscountType.PERCENTAGE) {
        return Math.max(total * (1 - coupon.discountValue / 100), 0)
    }

    return total
}
