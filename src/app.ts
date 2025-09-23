import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import errorHandlerPlugin from './plugins/errorHandlerPlugin.js'
import getAuthenticatedUserCartPlugin from './plugins/getAuthenticatedUserCartPlugin.js'
import jwtPlugin from './plugins/jwtPlugin.js'
import prismaPlugin from './plugins/prismaPlugin.js'
import swaggerPlugin from './plugins/swaggerPlugin.js'
import routes from './routes/index.js'

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
    server.register(getAuthenticatedUserCartPlugin)

    await server.register(swaggerPlugin)

    server.register(routes, { prefix: '/api' })

    return server
}
