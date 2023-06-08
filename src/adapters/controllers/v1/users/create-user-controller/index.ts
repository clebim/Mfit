import { inject, injectable } from '@core/dependency-injection'
import { requestLogger } from '@main/decorators'
import { InvalidDataError, UserAlreadyExitsError } from '@usecases/errors'
import { UseCaseError } from '@usecases/errors/use-case-error'
import { UserNotBusinessError } from '@usecases/errors/user/user-not-business-error'
import { CreateUserUseCase } from '@usecases/users/v1/create-user-use-case'
import { Controller } from '../../../port/controller'
import { HttpRequest } from '../../../port/http-request'
import { HttpResponse } from '../../../port/http-response'

@injectable()
export class CreateUserController extends Controller {
  constructor(
    @inject('CreateUserUseCase')
    private useCase: CreateUserUseCase,
  ) {
    super()
  }

  errors = new Map([
    [UserAlreadyExitsError.name, 409],
    [UserNotBusinessError.name, 403],
    [InvalidDataError.name, 422],
  ])

  @requestLogger()
  async handle(httpRequest: HttpRequest | undefined): Promise<HttpResponse> {
    const { isFailure, value } = await this.useCase.execute(httpRequest.body)

    if (isFailure()) {
      return this.buildError(value as UseCaseError)
    }

    return this.ok(value)
  }
}
