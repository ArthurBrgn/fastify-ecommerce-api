import { BaseApiException } from '@/exceptions/BaseApiException'

export class ProductOutOfStockException extends BaseApiException {
    constructor(message = 'Product is out of stock') {
        super(message, 409)
    }
}
