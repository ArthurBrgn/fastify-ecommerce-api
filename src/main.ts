import Fastify from 'fastify'
import routes from '@/routes'

const fastify = Fastify({
    logger: true,
})

fastify.register(routes)

fastify.listen({ port: 3000 }, function (err) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})
