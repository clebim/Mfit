import { CheckInProperties } from '@entities/check-in'
import { InvalidDataError } from '@usecases/errors'
import { Either } from '@usecases/helpers/either'

export interface FetchUserCheckInsHistoryResponseData {
  items: CheckInProperties[]
  page: number
  totalItemsPerPage: number
  totalPages: number
  totalItems: number
}

export type FetchUserCheckInsHistoryResponse = Either<
  InvalidDataError,
  FetchUserCheckInsHistoryResponseData
>
