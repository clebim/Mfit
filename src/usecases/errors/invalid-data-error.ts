import { UseCaseError } from './use-case-error'

export class InvalidDataError extends UseCaseError {
  public fields

  constructor(fields: [key: string]) {
    super('Invalid data.')
    super.name = InvalidDataError.name
    this.name = 'InvalidDataError'
    this.fields = fields
  }
}
