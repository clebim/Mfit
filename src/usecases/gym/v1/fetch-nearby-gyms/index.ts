import { UseCase } from '@usecases/port/use-case'
import { FetchNearbyGymsResponseData } from './interfaces/fetch-neaerby-gyms-response'
import { FetchNearbyGymsRequest } from './interfaces/fetch-nearby-gyms-request'
import { UseCaseCore } from '@usecases/core/use-case-core'
import { inject, injectable } from '@core/dependency-injection'
import { Logger, RequestValidator } from '@usecases/port/services'
import { GymRepository } from '@usecases/port/repositories'

export interface FetchNearbyGymsUseCase
  extends UseCase<FetchNearbyGymsRequest, FetchNearbyGymsResponseData> {}

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
  ): Promise<FetchNearbyGymsResponseData> {
    const { userId, userLatitude, userLongitude } = request

    this.logger.info(
      `Usuário ${userId} está buscando academias proximas a sua localização: ${userLatitude};${userLongitude}`,
    )

    const gyms = await this.gymRepository.findManyNearBy({
      userLatitude,
      userLongitude,
    })

    return {
      gyms: gyms.map((gym) => gym.toDTO()),
    }
  }
}
