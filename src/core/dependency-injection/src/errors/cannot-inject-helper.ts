import { constructor } from '../interfaces/constructor'

const formatDependency = (params: string | null, index: number): string => {
  if (params === null) {
    return `at position #${index}`
  }
  const argName = params.split(',')[index].trim()
  return `"${argName}" at position #${index}`
}

const composeErrorMessage = (
  msg: string,
  e: Error,
  indent = '    ',
): string => {
  return [msg, ...e.message.split('\n').map((l) => indent + l)].join('\n')
}

export const formatErrorCtor = (
  ctor: constructor<any>,
  paramIdx: number,
  error: Error,
): string => {
  const [, params = null] =
    ctor.toString().match(/constructor\(([\w, ]+)\)/) || []
  const dep = formatDependency(params, paramIdx)
  return composeErrorMessage(
    `Cannot inject the dependency ${dep} of "${ctor.name}" constructor. Reason:`,
    error,
  )
}
