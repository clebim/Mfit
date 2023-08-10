import { UseCaseError } from '../use-case-error'

export class LateCheckInError extends UseCaseError {
  constructor() {
    super('Check-in can only validated until 20 minutes of its creation')
    super.name = LateCheckInError.name
  }
}
