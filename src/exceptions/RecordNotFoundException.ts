import { BaseApiException } from './../exceptions/BaseApiException'

export class RecordNotFoundException extends BaseApiException {
    constructor(message = 'Record not found') {
        super(message, 404)
    }
}
