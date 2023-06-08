import winston, { createLogger } from 'winston'
import { Options } from '../interfaces/options'
import { Level } from '../interfaces/level'
import { transports } from '../config/transports'
import { LoggerCore } from '../interfaces/logger'

export class Logger implements LoggerCore {
  private logger: winston.Logger | undefined
  private options: Options = {}

  constructor(options?: Options | string) {
    if (typeof options === 'string') {
      this.options.context = options
    } else if (options) {
      this.options = options
    }
    this.setup()
  }

  setContext(context: string) {
    this.options.context = context
    this.setup()
  }

  setSilent(silent: boolean) {
    this.options.silent = silent
    this.setup()
  }

  private setup(): void {
    const config = {
      silent: this.options?.silent,
      level: this.options?.minLevel,
      transports: transports({ context: this.options?.context }),
    }
    if (!this.logger) {
      this.logger = createLogger(config)
      return
    }
    this.logger.configure(config)
  }

  debug<T>(message: T, ...meta: any[]) {
    this.print(Level.Debug, message, ...meta)
  }

  info<T>(message: T, ...meta: any[]) {
    this.print(Level.Info, message, ...meta)
  }

  warn<T>(message: T, ...meta: any[]) {
    this.print(Level.Warn, message, ...meta)
  }

  error<T>(error: T, ...meta: any[]) {
    if (error instanceof Error) {
      this.print(
        Level.Error,
        error?.stack ? error.stack : error.message ? error.message : error,
        ...meta,
      )
    } else {
      this.print(Level.Error, error, ...meta)
    }
  }

  private print<T>(level: Level, message: T, ...meta: any[]) {
    if (meta?.length) {
      this.logger![level](String(message), ...meta)
    } else {
      this.logger![level](message)
    }
  }
}
