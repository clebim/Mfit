export interface LoggerCore {
  setContext(context: string): void
  debug<T>(message: T, ...meta: any[]): void
  info<T>(message: T, ...meta: any[]): void
  warn<T>(message: T, ...meta: any[]): void
  error<T>(message: T, ...meta: any[]): void
  setSilent(silent: boolean): void
}
