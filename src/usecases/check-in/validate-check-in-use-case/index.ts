import { UseCaseCore } from '@usecases/core/use-case-core'
import { UseCase } from '@usecases/port/use-case'
import { ValidateCheckInRequest } from './interfaces/validate-check-in-request'
import { ValidateCheckInResponse } from './interfaces/validate-check-in-response'
import { inject, injectable } from '@core/dependency-injection'
import { Logger } from '@core/logger'
import { CheckInRepository } from '@usecases/port/repositories'
import { CheckInNotFoundError } from '@usecases/errors/check-in/check-in-not-found-error'
import { DateService } from '@usecases/port/services'

export interface ValidateCheckInUseCase
  extends UseCase<ValidateCheckInRequest, ValidateCheckInResponse> {}

@injectable()
export class ValidateCheckIn
  extends UseCaseCore<ValidateCheckInRequest>
  implements ValidateCheckInUseCase
{
  constructor(
    @inject('Logger')
    private looger: Logger,
    @inject('CheckInRepository')
    private checkInRepository: CheckInRepository,
    @inject('DateService')
    private dateService: DateService,
  ) {
    super()
  }

  async execute(
    request: ValidateCheckInRequest,
  ): Promise<ValidateCheckInResponse> {
    const { id, userId } = request
    this.looger.info(`Usuário ${userId} validando checkIn: ${id}`)

    const checkIn = await this.checkInRepository.findById(id)

    if (!checkIn) {
      return this.failure(new CheckInNotFoundError())
    }

    const validateAt = this.dateService.now()
    checkIn.update({
      validateAt: validateAt.toDate(),
    })

    return this.success({
      ...checkIn.toDTO(),
      validateAt: validateAt.format(),
    })
  }
}
