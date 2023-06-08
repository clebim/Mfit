import { IncomingHttpHeaders } from 'http'

export interface HttpResponse {
  statusCode: number
  body?: any
  headers?: IncomingHttpHeaders
}
