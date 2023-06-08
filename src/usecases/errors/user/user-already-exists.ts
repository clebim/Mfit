import { UseCaseError } from '../use-case-error'

export class UserAlreadyExitsError extends UseCaseError {
  constructor() {
    super('User already exists')
    super.name = UserAlreadyExitsError.name
  }
}
