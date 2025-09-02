import { buildApp } from './app'

const server = buildApp()

server.listen({ port: 3000 }, (err) => {
    if (err) {
        server.log.error(err)
        process.exit(1)
    }
})
