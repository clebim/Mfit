import { UseCaseError } from './use-case-error'

export class InternalServerError extends UseCaseError {
  constructor() {
    super('Internal server error')
    super.name = InternalServerError.name
  }
}
