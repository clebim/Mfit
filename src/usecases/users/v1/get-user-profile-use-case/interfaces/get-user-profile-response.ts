import { UserNotFound } from '@usecases/errors/user/user-not-found'
import { Either } from '@usecases/helpers/either'

export interface GetUserProfileResponseData {
  id: string
  name: string
  email: string
  createdAt: Date
}

export type GetUserProfileResponse = Either<
  UserNotFound,
  GetUserProfileResponseData
>
