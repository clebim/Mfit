import { inject, injectable } from '@core/dependency-injection'
import { Gym } from '@entities/gym'
import { UseCaseCore } from '@usecases/core/use-case-core'
import { validateIfIsBusinessUser } from '@usecases/decorators'
import { GymRepository } from '@usecases/port/repositories'
import { Logger, RequestValidator } from '@usecases/port/services'
import { UseCase } from '@usecases/port/use-case'
import { CreateGymRequest } from './interfaces/create-gym-request'
import {
  CreateGymResponse,
  CreateGymResponseData,
} from './interfaces/create-gym-response'

export interface CreateGymUseCase
  extends UseCase<CreateGymRequest, CreateGymResponse> {}

@injectable()
export class CreateGym
  extends UseCaseCore<CreateGymRequest>
  implements CreateGymUseCase
{
  constructor(
    @inject('Logger')
    private logger: Logger,
    @inject('GymRepository')
    private gymRepository: GymRepository,
    @inject('CreateGymValidator')
    validator: RequestValidator<CreateGymRequest>,
  ) {
    super(validator)
  }

  @validateIfIsBusinessUser()
  async execute(request: CreateGymRequest): Promise<CreateGymResponse> {
    try {
      this.validate(request)
      const { userId } = request

      this.logger.info(`Usuário ${userId} está criando uma nova academia`)

      const newGym = await this.gymRepository.save(Gym.from(request))

      this.logger.info(`Academia criada com sucesso para o usuário ${userId}`)

      return this.success(newGym.toDTO() as CreateGymResponseData)
    } catch (error) {
      this.logger.error('Erro ao criar academia %o', this.formatError(error))
      return this.failure(error)
    }
  }
}
