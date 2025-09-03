import { FastifyInstance } from 'fastify'
import { loginHandler, registerHandler, profileHandler } from '../controllers/authController'
import {
    loginSchema,
    loginResponseSchema,
    registerSchema,
    registerResponseSchema
} from '../schemas/authSchema'

export default function authRoutes(server: FastifyInstance) {
    server.post(
        '/login',
        { schema: { body: loginSchema, response: { 200: loginResponseSchema } } },
        loginHandler
    )
    server.post(
        '/register',
        { schema: { body: registerSchema, response: { 201: registerResponseSchema } } },
        registerHandler
    )

    server.get('/me', { onRequest: server.authenticate }, profileHandler)
}
