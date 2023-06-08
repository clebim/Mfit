import { formatErrorLog } from '@shared/format-error-log'
import { InternalServerError } from '@usecases/errors/internal-server-error'
import { InvalidDataError } from '@usecases/errors/invalid-data-error'
import { UseCaseError } from '@usecases/errors/use-case-error'
import { Either, failure, success } from '@usecases/helpers/either'
import { RequestValidator } from '@usecases/port/services/request-validator'

export abstract class UseCaseCore<Request> {
  constructor(private validator?: RequestValidator<Request>) {}

  protected validate(request: Request): void {
    if (this.validator) {
      const response = this.validator.validate(request)
      if (!response.isValid) {
        throw new InvalidDataError(response.invalidFields)
      }
    }
  }

  protected formatError(error: any) {
    return formatErrorLog(error)
  }

  protected success<S>(data?: S): Either<null, S> {
    return success(data)
  }

  protected failure<Error>(error: Error): Either<UseCaseError, null> {
    if (error instanceof UseCaseError) {
      return failure(error)
    }
    return failure(new InternalServerError())
  }
}
