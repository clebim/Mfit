import { GymProperties } from '@entities/gym'
import { InvalidDataError } from '@usecases/errors'
import { Either } from '@usecases/helpers/either'

export interface SearchGymsResponseData {
  items: GymProperties[]
  page: number
  totalItemsPerPage: number
  totalPages: number
  totalItems: number
}

export type SearchGymsResponse = Either<
  InvalidDataError,
  SearchGymsResponseData
>
