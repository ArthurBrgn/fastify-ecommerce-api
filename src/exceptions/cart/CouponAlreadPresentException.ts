import { BaseApiException } from '@/exceptions/BaseApiException'

export class CouponAlreayPresentException extends BaseApiException {
    constructor(message = 'Cannot add multiple coupons') {
        super(message, 409)
    }
}
