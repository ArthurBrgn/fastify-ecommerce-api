export default function applyCoupon(
    total: number,
    coupon?: { discountType: 'FIXED' | 'PERCENTAGE'; discountValue: number }
) {
    if (!coupon) return total

    if (coupon.discountType === 'FIXED') {
        return Math.max(total - coupon.discountValue, 0)
    } else if (coupon.discountType === 'PERCENTAGE') {
        return Math.max(total * (1 - coupon.discountValue / 100), 0)
    }
    
    return total
}
