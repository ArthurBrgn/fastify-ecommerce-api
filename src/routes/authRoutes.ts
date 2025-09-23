import { FastifyInstance } from 'fastify'
import {
    loginHandler,
    refreshAccessTokenHandler,
    registerHandler
} from './../controllers/authController.js'
import {
    loginResponseSchema,
    loginSchema,
    refreshAccessTokenResponseSchema,
    registerResponseSchema,
    registerSchema
} from './../schemas/authSchema.js'

export default function authRoutes(server: FastifyInstance) {
    server.post(
        '/login',
        {
            schema: {
                tags: ['Auth'],
                security: [],
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
                tags: ['Auth'],
                security: [],
                body: registerSchema,
                response: { 201: registerResponseSchema }
            }
        },
        registerHandler
    )

    server.get(
        '/refresh',
        {
            schema: {
                tags: ['Auth'],
                security: [{ refreshTokenCookie: [] }],
                response: { 200: refreshAccessTokenResponseSchema }
            }
        },
        refreshAccessTokenHandler
    )
}
