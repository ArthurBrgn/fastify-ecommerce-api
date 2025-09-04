import { FastifyInstance } from 'fastify'
import { loginHandler, profileHandler, registerHandler } from '../controllers/authController'
import {
    loginSchema,
    loginResponseSchema,
    registerSchema,
    registerResponseSchema,
    userProfileResponseSchema
} from '../schemas/authSchema'

export default function authRoutes(server: FastifyInstance) {
    server.post(
        '/login',
        { schema: { security: [], body: loginSchema, response: { 200: loginResponseSchema } } },
        loginHandler
    )
    server.post(
        '/register',
        {
            schema: {
                security: [],
                body: registerSchema,
                response: { 201: registerResponseSchema }
            }
        },
        registerHandler
    )

    server.get(
        '/me',
        {
            onRequest: [server.authenticate],
            schema: { response: { 200: userProfileResponseSchema } }
        },
        profileHandler
    )
}
