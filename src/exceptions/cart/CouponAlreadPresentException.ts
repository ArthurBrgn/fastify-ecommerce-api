import { BaseApiException } from './../../exceptions/BaseApiException.js'

export class CouponAlreayPresentException extends BaseApiException {
    constructor(message = 'Cannot add multiple coupons') {
        super(message, 409)
    }
}
