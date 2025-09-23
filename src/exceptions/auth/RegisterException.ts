import { BaseApiException } from './../../exceptions/BaseApiException'

export class RegisterException extends BaseApiException {
    constructor(message: string, statusCode = 500) {
        super(message, statusCode)
    }
}
