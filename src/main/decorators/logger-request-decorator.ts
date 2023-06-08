import { HttpRequest } from '@adapters/controllers/port/http-request'
import { MfitLogger } from '@external/logger'

type RequestLogger = {
  disable?: boolean
}

export const requestLogger = (props?: RequestLogger): MethodDecorator =>
  function (
    _: Object,
    __: string | symbol,
    descriptor: PropertyDescriptor,
  ): void {
    const logger = new MfitLogger()
    const originalValue = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const {
        body,
        params,
        url,
        headers,
        query,
        ip,
        method,
        hostname,
        routerPath,
      } = args[0] as HttpRequest

      const isDisable = props?.disable ?? process.env.NODE_ENV !== 'dev'

      const responseController = await originalValue!.apply(this, args)

      if (isDisable === false) {
        const context = 'api-request:info'
        logger.setContext(context)
        logger.info('%o', {
          context,
          ipAddress: headers['x-real-ip'] || headers['x-forwarded-for'],
          requestId: headers['X-Request-ID'],
          request: {
            headers: {
              'device-id': headers['device-id'],
              'user-agent': headers['user-agent'],
              'request-id': headers['X-Request-ID'],
            },
            body,
            params,
            query,
            config: {
              url,
              ip,
              method,
              hostname,
              path: routerPath,
            },
          },
          response: responseController,
        })
      }

      return responseController
    }
  }
