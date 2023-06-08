import winston from 'winston'
import { stringify } from 'flatted'

import { levelColors } from './level-colors'

winston.addColors(levelColors)

export interface FormatConfig {
  context?: string
}

const defaultFormat = ({ context }: FormatConfig) => {
  return (transformableInfo: winston.Logform.TransformableInfo) => {
    const { timestamp, level } = transformableInfo
    let { message } = transformableInfo
    if (typeof message === 'object') {
      message = stringify(message, null, 2)
    }
    return `[${timestamp}]${
      context ? `[${context}]` : ''
    }[${level}]: ${message}`
  }
}

export const transports = (formatConfig: FormatConfig) => [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.splat(),
      winston.format.timestamp(),
      winston.format.printf(defaultFormat(formatConfig)),
    ),
  }),
]
