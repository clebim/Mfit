import { UserType } from '@entities/enums/user-type-enum'
import { InvalidDataError, UserAlreadyExitsError } from '@usecases/errors'
import { Either } from '@usecases/helpers/either'

export interface CreateUserResponseData {
  name: string
  id: string
  email: string
  type: UserType
  createdAt: Date
}

export type CreateUserResponse = Either<
  InvalidDataError | UserAlreadyExitsError,
  CreateUserResponseData
>
