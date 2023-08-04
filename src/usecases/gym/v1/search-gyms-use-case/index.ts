import { UseCase } from '@usecases/port/use-case'
import { SearchGymsRequest } from './interfaces/search-gyms-request'
import { SearchGymsResponse } from './interfaces/search-gyms-response'
import { UseCaseCore } from '@usecases/core/use-case-core'
import { inject, injectable } from '@core/dependency-injection'
import { Logger, RequestValidator } from '@usecases/port/services'
import { GymRepository } from '@usecases/port/repositories'
import { FindManyGymsOptions } from '@usecases/port/repositories/gym-repository'

export interface SearchGymsUseCase
  extends UseCase<SearchGymsRequest, SearchGymsResponse> {}

@injectable()
export class SearchGyms
  extends UseCaseCore<SearchGymsRequest>
  implements SearchGymsUseCase
{
  constructor(
    @inject('Logger')
    private logger: Logger,
    @inject('GymRepository')
    private gymRepository: GymRepository,
    @inject('SearchGymsValidator')
    validator: RequestValidator<SearchGymsRequest>,
  ) {
    super(validator)
  }

  async execute(request: SearchGymsRequest): Promise<SearchGymsResponse> {
    try {
      this.validate(request)
      const { userId } = request
      const itemsPerPage = request.totalItemsPerPage ?? 20
      const page = request.page ?? 1

      const searchOptions: FindManyGymsOptions = {
        order: request.order ?? 'DESC',
        orderBy: request.orderBy ?? 'createdAt',
        skip: itemsPerPage * (page - 1),
        take: itemsPerPage,
        title: request.title,
      }

      this.logger.info(
        `Usuário ${userId} está buscando academias filtradas por %o`,
        request,
      )

      const { items, count } = await this.gymRepository.searchMany(
        searchOptions,
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
      this.logger.error('Erro ao buscar academias %o', this.formatError(error))
      return this.failure(error)
    }
  }
}
