import { UseCaseError } from '@usecases/errors'

export class UseCaseClassMock {
  failure(error: UseCaseError) {
    return { value: error, isFailure: () => true, isSuccess: () => false }
  }
}
