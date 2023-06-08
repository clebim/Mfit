import { IncomingHttpHeaders } from 'http'

export interface MFitTokenProps {
  userId: string
}

export interface HttpRequest {
  params?: any
  query?: any
  body?: any
  headers?: IncomingHttpHeaders
  ip?: any
  url?: string
  method?: string
  hostname?: string
  routerPath?: string
  mFitTokenProps: MFitTokenProps
}
