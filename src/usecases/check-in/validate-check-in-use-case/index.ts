import { UseCaseCore } from '@usecases/core/use-case-core'
import { UseCase } from '@usecases/port/use-case'
import { ValidateCheckInRequest } from './interfaces/validate-check-in-request'
import { ValidateCheckInResponse } from './interfaces/validate-check-in-response'
import { inject, injectable } from '@core/dependency-injection'
import { CheckInRepository, GymRepository } from '@usecases/port/repositories'
import { CheckInNotFoundError } from '@usecases/errors/check-in/check-in-not-found-error'
import { DateService, Logger } from '@usecases/port/services'
import { LateCheckInError } from '@usecases/errors/check-in/late-check-in-error'
import { validateIfIsBusinessUser } from '@usecases/decorators'

export interface ValidateCheckInUseCase
  extends UseCase<ValidateCheckInRequest, ValidateCheckInResponse> {}

@injectable()
export class ValidateCheckIn
  extends UseCaseCore<ValidateCheckInRequest>
  implements ValidateCheckInUseCase
{
  constructor(
    @inject('Logger')
    private logger: Logger,
    @inject('CheckInRepository')
    private checkInRepository: CheckInRepository,
    @inject('GymRepository')
    private gymRepository: GymRepository,
    @inject('DateService')
    private dateService: DateService,
  ) {
    super()
  }

  @validateIfIsBusinessUser()
  async execute(
    request: ValidateCheckInRequest,
  ): Promise<ValidateCheckInResponse> {
    try {
      const { id, userId } = request
      this.logger.info(`Usuário ${userId} validando checkIn: ${id}`)

      const checkIn = await this.checkInRepository.findById(id)

      if (!checkIn) {
        return this.failure(new CheckInNotFoundError())
      }

      const gym = (await this.gymRepository.findManyByUserId(userId)).find(
        (gym) => gym.getId() === checkIn.getGymId(),
      )

      if (!gym) {
        return this.failure(new CheckInNotFoundError())
      }

      const diffInMinutesFromCreation = this.dateService.diff(
        checkIn.getCreatedAt(),
        'minutes',
      )

      if (diffInMinutesFromCreation > 20) {
        return this.failure(new LateCheckInError())
      }

      const validateAt = this.dateService.now()
      checkIn.update({
        validateAt: validateAt.toDate(),
      })

      return this.success({
        ...checkIn.toDTO(),
        validateAt: validateAt.format(),
      })
    } catch (error) {
      this.logger.error(
        `Erro ao validar checkIn ${request.id}`,
        this.formatError(error),
      )
      return this.failure(error)
    }
  }
}
