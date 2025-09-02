import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import routes from './routes/routes'
import prismaPlugin from './plugins/prismaPlugin'
import jwtPlugin from './plugins/jwtPlugin'
import errorHandlerPlugin from './plugins/errorHandlerPlugin'

export function buildApp() {
    const server = Fastify({
        logger: true
    }).withTypeProvider<ZodTypeProvider>()

    // Link Zod as validator / serializer
    server.setValidatorCompiler(validatorCompiler)
    server.setSerializerCompiler(serializerCompiler)

    server.register(prismaPlugin)
    server.register(jwtPlugin)
    server.register(errorHandlerPlugin)
    server.register(routes, { prefix: '/api' })

    return server
}
