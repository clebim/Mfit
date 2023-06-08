import env from 'dotenv'
import { resolve } from 'path'

env.config({
  path: resolve(`./env/.env.${process.env.NODE_ENV}`),
})

const environment = process.env.ENVIRONMENT || process.env.NODE_ENV

export const config = {
  server: {
    port: Number(process.env.PORT) || 3333,
    host: process.env.HOST || '0.0.0.0',
    environment,
  },
  looger: {
    isDisable: environment === 'test',
  },
}
