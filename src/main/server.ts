import 'reflect-metadata'
import { app } from './app'
import { config } from './config'

const port = config.server.port
const host = config.server.host

app()
  .listen({
    port,
    host,
  })
  .then(() => {
    console.log(`Worker ${process.pid} running server on port ${port} 🚀🚀🚀`)
  })
