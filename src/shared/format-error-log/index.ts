export const formatErrorLog = (error: Error) => {
  const logger: any = {}

  logger.stack = error.stack
  logger.name = error.name
  logger.message = error.message

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
    ...logger,
    ...publicProperties,
  }
}
