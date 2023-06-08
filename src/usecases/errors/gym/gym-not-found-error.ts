import { UseCaseError } from '../use-case-error'

export class GymNotFoundError extends UseCaseError {
  constructor() {
    super('Gym not found')
    super.name = GymNotFoundError.name
  }
}
