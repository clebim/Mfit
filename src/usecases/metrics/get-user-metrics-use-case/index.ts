import { UseCaseCore } from '@usecases/core/use-case-core'
import { GetUserMetricsRequest } from './interfaces/get-user-metrics-request'
import { CheckInRepository } from '@usecases/port/repositories'
import { Logger } from '@usecases/port/services'
import { inject, injectable } from '@core/dependency-injection'
import { GetUserMetricsResponse } from './interfaces/get-user-metrics-response'
import { UseCase } from '@usecases/port/use-case'

export interface GetUserMetricsUseCase
  extends UseCase<GetUserMetricsRequest, GetUserMetricsResponse> {}

@injectable()
export class GetUserMetrics
  extends UseCaseCore<GetUserMetricsRequest>
  implements GetUserMetricsUseCase
{
  constructor(
    @inject('Logger')
    private logger: Logger,
    @inject('CheckInRepository')
    private checkInRepository: CheckInRepository,
  ) {
    super()
  }

  async execute({
    userId,
  }: GetUserMetricsRequest): Promise<GetUserMetricsResponse> {
    try {
      this.logger.info(`Buscando checkIns do usuário ${userId}`)

      const checkInsCount = await this.checkInRepository.countByUserId(userId)

      return this.success({ checkInsCount })
    } catch (error) {
      this.logger.error(
        'Erro ao listar metricas de checkIns do usuário %o',
        this.formatError(error),
      )
      return this.failure(error)
    }
  }
}
