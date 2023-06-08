import { UserType } from '@entities/enums/user-type-enum'

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  type: UserType
}
