import { Logger as LoggerImpl } from '@core/logger'
import { Logger } from '@usecases/port/services'

export class MfitLogger extends LoggerImpl implements Logger {}
