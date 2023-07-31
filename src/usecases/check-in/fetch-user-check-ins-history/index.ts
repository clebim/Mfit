import { inject, injectable } from '@core/dependency-injection'
import { UseCaseCore } from '@usecases/core/use-case-core'
import { CheckInRepository } from '@usecases/port/repositories'
import { Logger, RequestValidator } from '@usecases/port/services'
import { DateService } from '@usecases/port/services/date-service'
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
    @inject('DateService')
    private dateService: DateService,
    @inject('CheckInRepository')
    private checkInRepository: CheckInRepository,
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

      const itemsPerPage = request.totalItemsPerPage ?? 20
      const page = request.page ?? 1
      const fetchOptions = {
        userId: request.userId,
        startDate:
          request.startDate ??
          this.dateService.sub(new Date(), 7, 'days').toUtc().toDate(),
        endDate: request.endDate ?? this.dateService.newDate().toUtc().toDate(),
        order: request.order ?? 'DESC',
        orderBy: request.orderBy ?? 'createdAt',
        skip: itemsPerPage * (page - 1),
        take: itemsPerPage,
      }

      this.logger.info('Buscando checkIns do usuário %o', fetchOptions)

      const { count, items } = await this.checkInRepository.findManyByUserId(
        fetchOptions,
      )

      const totalPages = Math.ceil(count / itemsPerPage)

      return this.success({
        page,
        totalItems: count,
        totalItemsPerPage: itemsPerPage,
        totalPages,
        items: items.map((item) => item.toDTO()),
      })
    } catch (error) {
      this.logger.error(
        'Erro ao listar histórico de checkIns do usuário %o',
        this.formatError(error),
      )
      return this.failure(error)
    }
  }
}
