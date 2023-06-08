import { UseCaseError } from '../use-case-error'

export class InvalidCredentialsError extends UseCaseError {
  constructor() {
    super('Invalid credentials error')
    super.name = InvalidCredentialsError.name
  }
}
