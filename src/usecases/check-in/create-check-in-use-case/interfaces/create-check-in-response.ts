import { CheckInOnSameDayError } from '@usecases/errors/check-in/check-in-on-same-day-error'
import { GymNotFoundError } from '@usecases/errors/gym/gym-not-found-error'
import { Either } from '@usecases/helpers/either'

export interface CreateCheckInResponseData {
  id: string
  userId: string
  gymId: string
  createdAt: Date
}

export type CreateCheckInResponse = Either<
  GymNotFoundError | CheckInOnSameDayError,
  CreateCheckInResponseData
>
