import { inject, injectable } from '@core/dependency-injection'
import { UseCaseCore } from '@usecases/core/use-case-core'
import { UserRepository } from '@usecases/port/repositories'
import { Logger } from '@usecases/port/services'
import { UseCase } from '@usecases/port/use-case'
import { GetUserProfileRequest } from './interfaces/get-user-profile-request'
import { GetUserProfileResponse } from './interfaces/get-user-profile-response'

export interface GetUserProfileUseCase
  extends UseCase<GetUserProfileRequest, GetUserProfileResponse> {}

@injectable()
export class GetUserProfile
  extends UseCaseCore<GetUserProfileRequest>
  implements GetUserProfileUseCase
{
  constructor(
    @inject('Logger')
    private logger: Logger,
    @inject('UserRepository')
    private userRepository: UserRepository,
  ) {
    super()
  }

  async execute(
    request: GetUserProfileRequest,
  ): Promise<GetUserProfileResponse> {
    try {
      const { userId } = request
      this.logger.info(`Buscando usuário com id: ${userId} no banco de dados`)
      const user = (await this.userRepository.findOneById(userId)).toDTO()

      return this.success({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      })
    } catch (error) {
      this.logger.error('Falha ao buscar usuário no banco de dados %o', error)
      return this.failure(error)
    }
  }
}
