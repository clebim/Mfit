import { DateMethods, DateService, Unit } from '@usecases/port/services'
import moment from 'moment-timezone'

export class MomentDateService implements DateService {
  private buildResponse(momentDate: moment.Moment): DateMethods {
    return {
      toDate: () => momentDate.toDate(),
      toIsoString: () => momentDate.toISOString(),
      toString: () => momentDate.toString(),
      format: (format?: string) => momentDate.format(format),
      toUtc: () => this.buildResponse(moment.utc(momentDate)),
      toTimeZone: (timeZone: string) =>
        this.buildResponse(moment(momentDate).tz(timeZone)),
    }
  }

  public sub(date: Date | string, amount: number, unit: Unit) {
    const momentDate = moment(date).subtract(amount, unit)

    return this.buildResponse(momentDate)
  }

  public newDate(): DateMethods {
    return this.buildResponse(moment())
  }
}
