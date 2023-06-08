import '@external/ioc/index'
import fastify from 'fastify'
import { setupMiddlewares } from './middlewares'
import { appRouter } from './routes'

export const app = () => {
  const fastifyApp = fastify()

  setupMiddlewares(fastifyApp)
  fastifyApp.register(appRouter)

  return fastifyApp
}
