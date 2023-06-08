import { UseCaseError } from '../use-case-error'

export class DistanceGreaterThanAllowedError extends UseCaseError {
  constructor() {
    super('Distance greater than allowed')
    super.name = DistanceGreaterThanAllowedError.name
  }
}
