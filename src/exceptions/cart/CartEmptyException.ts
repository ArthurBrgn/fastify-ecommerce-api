import { BaseApiException } from './../../exceptions/BaseApiException.js'

export class CartEmptyException extends BaseApiException {
    constructor(message = 'Cart is empty') {
        super(message, 400)
    }
}
