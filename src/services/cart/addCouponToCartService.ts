import { CouponAlreayPresentException } from './../../exceptions/cart/CouponAlreadPresentException.js'
import { RecordNotFoundException } from './../../exceptions/RecordNotFoundException.js'
import { AppPrismaClient } from './../../plugins/prismaPlugin.js'

export default async function addCouponToCart(
    prisma: AppPrismaClient,
    couponCode: string,
    userId: number
) {
    const cart = await prisma.cart.findUnique({
        where: { userId },
        select: {
            id: true,
            couponId: true
        }
    })

    if (!cart) {
        throw new RecordNotFoundException('Cart not found')
    }

    if (cart.couponId) {
        throw new CouponAlreayPresentException()
    }

    const coupon = await prisma.coupon.findFirst({
        select: { id: true },
        where: {
            code: couponCode,
            expiresAt: { gte: new Date() }
        }
    })

    if (!coupon) {
        throw new RecordNotFoundException('Coupon not found or expired')
    }

    await prisma.cart.update({
        where: { id: cart.id },
        data: {
            couponId: coupon.id
        }
    })
}
