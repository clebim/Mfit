import { UseCaseError } from '../use-case-error'

export class UserNotFound extends UseCaseError {
  constructor() {
    super('User not found')
    super.name = UserNotFound.name
  }
}
