import { UseCase } from '@usecases/port/use-case'
import { FetchNearbyGymsResponse } from './interfaces/fetch-neaerby-gyms-response'
import { FetchNearbyGymsRequest } from './interfaces/fetch-nearby-gyms-request'
import { UseCaseCore } from '@usecases/core/use-case-core'
import { inject, injectable } from '@core/dependency-injection'
import { Logger, RequestValidator } from '@usecases/port/services'
import { GymRepository } from '@usecases/port/repositories'

export interface FetchNearbyGymsUseCase
  extends UseCase<FetchNearbyGymsRequest, FetchNearbyGymsResponse> {}

@injectable()
export class FetchNearbyGyms
  extends UseCaseCore<FetchNearbyGymsRequest>
  implements FetchNearbyGymsUseCase
{
  constructor(
    @inject('Logger')
    private logger: Logger,
    @inject('GymRepository')
    private gymRepository: GymRepository,
    @inject('SearchGymsValidator')
    validator: RequestValidator<FetchNearbyGymsRequest>,
  ) {
    super(validator)
  }

  async execute(
    request: FetchNearbyGymsRequest,
  ): Promise<FetchNearbyGymsResponse> {
    try {
      this.validate(request)
      const { userId, userLatitude, userLongitude } = request

      this.logger.info(
        `Usuário ${userId} está buscando academias proximas a sua localização: ${userLatitude};${userLongitude}`,
      )

      const gyms = await this.gymRepository.findManyNearBy({
        userLatitude,
        userLongitude,
      })

      return this.success({
        gyms: gyms.map((gym) => gym.toDTO()),
      })
    } catch (error) {
      this.logger.error(
        'Erro ao buscar academias próximas %o',
        this.formatError(error),
      )
      return this.failure(error)
    }
  }
}
