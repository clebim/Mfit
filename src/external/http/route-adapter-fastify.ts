import { Controller } from '@adapters/controllers/port/controller'
import { HttpRequest } from '@adapters/controllers/port/http-request'
import { mFitContainer } from '@external/ioc'
import { FastifyReply, FastifyRequest } from 'fastify'

export const routeAdapterFastify =
  (controllerKey: string) =>
  async (req: FastifyRequest, reply: FastifyReply) => {
    const request: HttpRequest = {
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
      ip: req.ip,
      hostname: req.hostname,
      method: req.method,
      routerPath: req.routerPath,
      url: req.url,
      mFitTokenProps: { userId: '72190e8e-d409-41a3-87ec-a101c5966af5' },
    }
    const controllerInstance = mFitContainer.resolve<Controller>(controllerKey)

    const httpResponse = await controllerInstance.handle(request)
    return reply
      .status(httpResponse.statusCode)
      .headers({
        ...httpResponse.headers,
      })
      .send(httpResponse.body)
  }
