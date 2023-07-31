import { UseCaseError } from '@usecases/errors'
import { Either } from '@usecases/helpers/either'

export interface GetUserMetricsResponseData {
  checkInsCount: number
}

export type GetUserMetricsResponse = Either<
  UseCaseError,
  GetUserMetricsResponseData
>
