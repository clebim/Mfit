import { config } from '@main/config'
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

export const errorHandler = (
  error: FastifyError,
  _: FastifyRequest,
  reply: FastifyReply,
) => {
  if (config.server.environment === 'dev') {
    return reply.status(500).send({
      message: 'Internal server error',
      error,
    })
  }

  return reply.status(500).send({
    message: 'Internal Server error',
  })
}
