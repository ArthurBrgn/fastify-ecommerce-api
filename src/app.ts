import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import errorHandlerPlugin from './plugins/errorHandlerPlugin'
import getAuthenticatedUserCartPlugin from './plugins/getAuthenticatedUserCartPlugin'
import jwtPlugin from './plugins/jwtPlugin'
import prismaPlugin from './plugins/prismaPlugin'
import swaggerPlugin from './plugins/swaggerPlugin'
import routes from './routes/index'

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
