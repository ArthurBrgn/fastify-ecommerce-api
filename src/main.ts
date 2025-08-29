import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", (req, res) => {
  res.send("Hello World");
});

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    fastify.log.info(`Server is running on ${address}`);
  })