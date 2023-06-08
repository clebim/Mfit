import { InvalidDataError } from '@usecases/errors'
import { UserNotBusinessError } from '@usecases/errors/user/user-not-business-error'
import { Either } from '@usecases/helpers/either'

export interface CreateGymResponseData {
  id: string
  userId: string
  title: string
  description?: string
  phone: string
  latitude: number
  longitude: number
  createdAt: Date
}

export type CreateGymResponse = Either<
  InvalidDataError | UserNotBusinessError,
  CreateGymResponseData
>
