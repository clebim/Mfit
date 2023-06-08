import { inject, injectable } from '@core/dependency-injection'
import { CheckIn } from '@entities/check-in'
import { UseCaseCore } from '@usecases/core/use-case-core'
import { CheckInOnSameDayError } from '@usecases/errors/check-in/check-in-on-same-day-error'
import { DistanceGreaterThanAllowedError } from '@usecases/errors/check-in/distance-greater-than-allowed-error'
import { GymNotFoundError } from '@usecases/errors/gym/gym-not-found-error'
import { CheckInRepository, GymRepository } from '@usecases/port/repositories'
import { Logger, RequestValidator } from '@usecases/port/services'
import { UseCase } from '@usecases/port/use-case'
import { CreateCheckInRequest } from './interfaces/create-check-in-request'
import { CreateCheckInResponse } from './interfaces/create-check-in-response'

interface Coordinate {
  latitude: number
  longitude: number
}

export interface CreateCheckInUseCase
  extends UseCase<CreateCheckInRequest, CreateCheckInResponse> {}

@injectable()
export class CreateCheckIn
  extends UseCaseCore<CreateCheckInRequest>
  implements CreateCheckInUseCase
{
  constructor(
    @inject('Logger')
    private looger: Logger,
    @inject('CheckInRepository')
    private checkInRepository: CheckInRepository,
    @inject('GymRepository')
    private gymRepository: GymRepository,
    @inject('CreateCheckInValidator')
    validator: RequestValidator<CreateCheckInRequest>,
  ) {
    super(validator)
  }

  private MAX_DISTACE_IN_KILOMETERS = 0.1

  private getDistanceBetweenCoordinatesInKilometers(
    from: Coordinate,
    to: Coordinate,
  ) {
    if (from.latitude === to.latitude && from.longitude === to.longitude) {
      return 0
    }

    const fromRadian = (Math.PI * from.latitude) / 180
    const toRadian = (Math.PI * to.latitude) / 180

    const theta = from.longitude - to.longitude
    const radTheta = (Math.PI * theta) / 180

    let dist =
      Math.sin(fromRadian) * Math.sin(toRadian) +
      Math.cos(fromRadian) * Math.cos(toRadian) * Math.cos(radTheta)

    if (dist > 1) {
      dist = 1
    }

    dist = Math.acos(dist)
    dist = (dist * 180) / Math.PI
    dist = dist * 60 * 1.1515
    dist = dist * 1.609344

    return dist
  }

  async execute(request: CreateCheckInRequest): Promise<CreateCheckInResponse> {
    try {
      this.validate(request)
      const { userId, gymId, userLatitude, userLongitude } = request

      this.looger.info(`Buncando gym com id: ${gymId} no banco de dados`)
      const gym = await this.gymRepository.findById(gymId)

      if (!gym) {
        this.looger.error('Gym não encontrada!')
        return this.failure(new GymNotFoundError())
      }

      const checkInOnSameDay = await this.checkInRepository.findByUserIdOnDate(
        userId,
        new Date(),
      )

      if (checkInOnSameDay) {
        this.looger.info('Ja foi feito um checkIn neste dia.')
        return this.failure(new CheckInOnSameDayError())
      }

      this.looger.info('Calculando distância do usuário para a gym')
      const distance = this.getDistanceBetweenCoordinatesInKilometers(
        { latitude: userLatitude, longitude: userLongitude },
        { latitude: gym.getLatitude(), longitude: gym.getLongitude() },
      )

      if (distance > this.MAX_DISTACE_IN_KILOMETERS) {
        this.looger.error(
          `Distancia: ${distance} do usuario maior que a permitida ${this.MAX_DISTACE_IN_KILOMETERS}`,
        )
        return this.failure(new DistanceGreaterThanAllowedError())
      }
      this.looger.info('Usuário se encontra dentro da distância permitida')

      const newCheckIn = await this.checkInRepository.save(
        CheckIn.from({
          gymId,
          userId,
        }),
      )
      this.looger.info(
        `CheckIn cadastrado com sucesso para o usuário ${userId}, gym: ${gymId}`,
      )

      return this.success({
        id: newCheckIn.getId(),
        userId,
        gymId,
        createdAt: newCheckIn.getCreatedAt(),
      })
    } catch (error) {
      this.looger.error(
        'Falha ao cadastrar um novo checkIn %o',
        this.formatError(error),
      )
      return this.failure(error)
    }
  }
}
