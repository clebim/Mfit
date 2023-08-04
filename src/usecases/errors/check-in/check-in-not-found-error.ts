import { UseCaseError } from '../use-case-error'

export class CheckInNotFoundError extends UseCaseError {
  constructor() {
    super('CheckIn not found')
    super.name = CheckInNotFoundError.name
  }
}
