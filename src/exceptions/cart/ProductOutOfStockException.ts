import { BaseApiException } from './../../exceptions/BaseApiException.js'

export class ProductOutOfStockException extends BaseApiException {
    constructor(message = 'Product is out of stock') {
        super(message, 409)
    }
}
