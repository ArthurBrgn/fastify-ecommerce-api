import { BaseApiException } from './../../exceptions/BaseApiException.js'

export class RegisterException extends BaseApiException {
    constructor(message: string, statusCode = 500) {
        super(message, statusCode)
    }
}
