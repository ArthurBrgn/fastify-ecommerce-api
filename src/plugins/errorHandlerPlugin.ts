import fp from 'fastify-plugin'
import { ZodError } from 'zod'
import { BaseApiException } from './../exceptions/BaseApiException.js'

export default fp(async (server) => {
    server.setErrorHandler((error, _request, reply) => {
        // Validation errors throwed by zod
        if (error instanceof ZodError) {
            return reply.code(422).send({
                errors: error.issues.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            })
        }

        // Validation errors throwed by fastify
        if (error.validation) {
            return reply.code(422).send({
                errors: error.validation.map((e) => ({
                    field: e.instancePath.replace(/^\//, '').replace(/\//g, '.'), // format field path : "field.subfield"
                    message: e.message
                }))
            })
        }

        // Custom API errors
        if (error instanceof BaseApiException) {
            return reply.code(error.statusCode).send({
                message: error.message
            })
        }

        // Default
        return reply.code(error.statusCode ?? 500).send({
            message: error.message
        })
    })
})
