import { UseCaseError } from '../use-case-error'

export class CheckInOnSameDayError extends UseCaseError {
  constructor() {
    super('Cannot have two check in on same day')
    super.name = CheckInOnSameDayError.name
  }
}
