import { GymProperties } from '@entities/gym'
import { InvalidDataError } from '@usecases/errors'
import { Either } from '@usecases/helpers/either'

export interface FetchNearbyGymsResponseData {
  gyms: GymProperties[]
}

export type FetchNearbyGymsResponse = Either<
  InvalidDataError,
  FetchNearbyGymsResponseData
>
