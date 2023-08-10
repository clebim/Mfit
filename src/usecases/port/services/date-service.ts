export type DateMethods = {
  toDate: () => Date
  toIsoString: () => string
  toString: () => string
  format: (format?: string) => string
  toUtc: () => DateMethods
  toTimeZone: (timeZone: string) => DateMethods
}

export type Unit = 'days' | 'minutes' | 'hours' | 'seconds'

export interface DateService {
  sub(date: Date | string, amount: number, unit: Unit): DateMethods
  isAfterNow(date: Date | string): boolean
  diff(diff: string | Date, unit: Unit, b?: string | Date): number
  now(): DateMethods
}
