import Fastify from 'fastify'
import routes from './routes/routes'
import prismaPlugin from './plugins/prismaPlugin'
import jwtPlugin from './plugins/jwtPlugin'

const server = Fastify({
    logger: true,
})

server.register(prismaPlugin)
server.register(jwtPlugin)
server.register(routes, { prefix: '/api' })

server.listen({ port: 3000 }, function (err) {
    if (err) {
        server.log.error(err)
        process.exit(1)
    }
})
