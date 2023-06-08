import { UseCaseError } from '../use-case-error'

export class UserNotBusinessError extends UseCaseError {
  constructor() {
    super('User not business')
    super.name = UserNotBusinessError.name
  }
}
