import { FastifyInstance } from 'fastify'
import { errorHandler } from './error-handler'

export const setupMiddlewares = (app: FastifyInstance): FastifyInstance => {
  app.setErrorHandler(errorHandler)
  return app
}
