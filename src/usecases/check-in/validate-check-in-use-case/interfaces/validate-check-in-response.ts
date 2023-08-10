import { CheckInProperties } from '@entities/check-in'
import { CheckInNotFoundError } from '@usecases/errors/check-in/check-in-not-found-error'
import { LateCheckInError } from '@usecases/errors/check-in/late-check-in-error'
import { Either } from '@usecases/helpers/either'

export type ValidateCheckInResponseData = Omit<
  CheckInProperties,
  'validateAt'
> & {
  validateAt: string
}

export type ValidateCheckInResponse = Either<
  CheckInNotFoundError | LateCheckInError,
  ValidateCheckInResponseData
>
