import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import fp from 'fastify-plugin'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'

export default fp(async (server) => {
    await server.register(swagger, {
        openapi: {
            info: {
                title: 'E-commerce API',
                description: 'Fastify e-commerce API docs',
                version: '1.0.0'
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            },
            security: [{ bearerAuth: [] }],
            servers: [
                {
                    url: 'http://localhost:3000'
                }
            ]
        },
        transform: jsonSchemaTransform
    })

    await server.register(swaggerUI, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false
        }
    })
})
