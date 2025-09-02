import fp from 'fastify-plugin'
import { ZodError } from 'zod'

export default fp(async (server) => {
    server.setErrorHandler((error, _request, reply) => {
        if (error instanceof ZodError) {
            return reply.status(422).send({
                errors: error.issues.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                })),
            })
        }

        if (error.validation) {
            return reply.status(422).send({
                errors: error.validation.map((e) => ({
                    field: e.instancePath.replace(/^\//, ''),
                    message: e.message,
                })),
            })
        }

        return reply.status(error.statusCode ?? 500).send({
            message: error.message,
        })
    })
})
