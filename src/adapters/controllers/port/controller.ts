import { UseCaseError } from '@usecases/errors/use-case-error'
import { HttpRequest } from './http-request'
import { HttpResponse } from './http-response'

abstract class Controller {
  abstract errors: Map<string, number>

  abstract handle(httpRequest: HttpRequest): Promise<HttpResponse>

  protected ok(data: any): HttpResponse {
    return {
      statusCode: 200,
      body: data,
    }
  }

  protected serverError(reason: string): HttpResponse {
    return {
      statusCode: 500,
      body: {
        message: reason,
      },
    }
  }

  protected buildError(error: UseCaseError): HttpResponse {
    const errorName = error.name

    if (this.errors.has(errorName)) {
      const statusCode = this.errors.get(errorName)

      const publicProperties = Object.entries(error).reduce(
        (obj: any, item: any[]) => {
          const value = item[1]
          if (typeof value === 'object' && Object.keys(value).length === 0) {
            return obj
          }
          return Object.assign(obj, { [item[0]]: value })
        },
        {},
      )

      return {
        statusCode,
        body: {
          message: error.message,
          ...publicProperties,
        },
      }
    }

    return {
      statusCode: 500,
      body: {
        message: 'Internal server error',
      },
    }
  }

  protected created(data: any): HttpResponse {
    return {
      statusCode: 201,
      body: data,
    }
  }
}

export { Controller }
