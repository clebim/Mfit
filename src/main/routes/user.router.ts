import { routeAdapterFastify } from '@external/http/route-adapter-fastify'
import { FastifyInstance } from 'fastify'

export const userRouter = async (
  app: FastifyInstance,
): Promise<FastifyInstance> => {
  app.post('/users', routeAdapterFastify('CreateUserController'))

  return app
}
