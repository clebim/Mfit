import { inject, injectable } from '@core/dependency-injection'
import { UseCaseCore } from '@usecases/core/use-case-core'
import { Logger, RequestValidator } from '@usecases/port/services'
import { UseCase } from '@usecases/port/use-case'
import { FetchUserCheckInsHistoryRequest } from './interfaces/fetch-user-check-ins-history-request'
import { FetchUserCheckInsHistoryResponse } from './interfaces/fetch-user-check-ins-history-response'

export interface FetchUserCheckInsHistoryUseCase
  extends UseCase<
    FetchUserCheckInsHistoryRequest,
    FetchUserCheckInsHistoryResponse
  > {}

@injectable()
export class FetchUserCheckInsHistory
  extends UseCaseCore<FetchUserCheckInsHistoryRequest>
  implements FetchUserCheckInsHistoryUseCase
{
  constructor(
    @inject('Logger')
    private logger: Logger,
    @inject('FetchUserCheckInsHistoryValidator')
    validator: RequestValidator<FetchUserCheckInsHistoryRequest>,
  ) {
    super(validator)
  }

  async execute(
    request: FetchUserCheckInsHistoryRequest,
  ): Promise<FetchUserCheckInsHistoryResponse> {
    try {
      this.validate(request)
    } catch (error) {
      this.logger.error(
        'Erro ao listar histórico de checkIns do usuário %o',
        this.formatError(error),
      )
      return this.failure(error)
    }
  }
}
