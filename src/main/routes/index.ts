import { FastifyInstance } from 'fastify'
import { userRouter } from './user.router'

export const appRouter = async (
  app: FastifyInstance,
): Promise<FastifyInstance> => {
  app.register(userRouter)

  return app
}
