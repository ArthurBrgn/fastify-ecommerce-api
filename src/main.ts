import { buildApp } from './app.js'

const server = await buildApp()

server.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
    if (err) {
        server.log.error(err)
        process.exit(1)
    }
})
