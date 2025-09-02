import { loginHandler, registerHandler } from '../controllers/authController'

import {
    loginResponseSchema,
    loginSchema,
    registerResponseSchema,
    registerSchema
} from '../schemas/authSchema'
import { FastifyInstance } from 'fastify'

export default function routes(server: FastifyInstance) {
    server.post(
        '/login',
        {
            schema: {
                body: loginSchema,
                response: { 200: loginResponseSchema }
            }
        },
        loginHandler
    )

    server.post(
        '/register',
        {
            schema: {
                body: registerSchema,
                response: { 201: registerResponseSchema }
            }
        },
        registerHandler
    )
}
