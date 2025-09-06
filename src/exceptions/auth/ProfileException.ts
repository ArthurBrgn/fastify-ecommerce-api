import { BaseApiException } from '@/exceptions/BaseApiException'

export class ProfileException extends BaseApiException {
    constructor(message: string, statusCode = 500) {
        super(message, statusCode)
    }
}
