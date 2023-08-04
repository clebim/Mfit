import { inject, injectable } from '@core/dependency-injection'
import { UserType } from '@entities/enums/user-type-enum'
import { UseCaseCore } from '@usecases/core/use-case-core'
import { InvalidCredentialsError } from '@usecases/errors/authenticate/invalid-credentials-error'
import { UserRepository } from '@usecases/port/repositories'
import {
  EncryptionService,
  Logger,
  RequestValidator,
} from '@usecases/port/services'
import { UseCase } from '@usecases/port/use-case'
import { AuthenticateRequest } from './interfaces/authenticate-request'
import { AuthenticateResponse } from './interfaces/authenticate-response'

export interface AuthenticateUseCase
  extends UseCase<AuthenticateRequest, AuthenticateResponse> {}

@injectable()
export class Authenticate
  extends UseCaseCore<AuthenticateRequest>
  implements AuthenticateUseCase
{
  constructor(
    @inject('Logger')
    private logger: Logger,
    @inject('UserRepository')
    private userRepository: UserRepository,
    @inject('EncryptionService')
    private encryptionService: EncryptionService,
    @inject('CreateAuthenticationValidator')
    validator: RequestValidator<AuthenticateRequest>,
  ) {
    super(validator)
  }

  async execute(request: AuthenticateRequest): Promise<AuthenticateResponse> {
    try {
      this.validate(request)
      const { email, password, clientId } = request

      const user = await this.userRepository.findOneByEmail(email)

      if (!user) {
        return this.failure(new InvalidCredentialsError())
      }

      if (clientId === 'WEB' && user.getType() === UserType.NORMAL) {
        return this.failure(new InvalidCredentialsError())
      }

      const doesPasswordMatches = await this.encryptionService.compare(
        password,
        user.getPassword(),
      )

      if (!doesPasswordMatches) {
        return this.failure(new InvalidCredentialsError())
      }
    } catch (error) {
      this.logger.error(
        'Erro ao criar uma autenticação %o',
        this.formatError(error),
      )
      return this.failure(error)
    }
  }
}
