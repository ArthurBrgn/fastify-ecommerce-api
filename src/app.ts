import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import routes from './routes'
import prismaPlugin from './plugins/prismaPlugin'
import jwtPlugin from './plugins/jwtPlugin'
import errorHandlerPlugin from './plugins/errorHandlerPlugin'
import swaggerPlugin from './plugins/swaggerPlugin'

export async function buildApp() {
    const server = Fastify({
        logger: true
    }).withTypeProvider<ZodTypeProvider>()

    // Link Zod as validator / serializer
    server.setValidatorCompiler(validatorCompiler)
    server.setSerializerCompiler(serializerCompiler)

    server.register(jwtPlugin)
    server.register(prismaPlugin)
    server.register(errorHandlerPlugin)

    await server.register(swaggerPlugin)

    server.register(routes, { prefix: '/api' })

    return server
}
