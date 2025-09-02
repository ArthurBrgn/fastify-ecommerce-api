import { BaseApiException } from '../BaseApiException'

export class AuthenticationException extends BaseApiException {
    constructor(message = 'Invalid email or password') {
        super(message, 401)
    }
}
