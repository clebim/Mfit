import { AuthenticateRequest } from '@usecases/authentication/authenticate/interfaces/authenticate-request'
import { CreateCheckInRequest } from '@usecases/check-in/create-check-in-use-case/interfaces/create-check-in-request'
import { CreateGymRequest } from '@usecases/gym/v1/create-gym-use-case/interfaces/create-gym-request'
import { RequestValidator } from '@usecases/port/services'
import { CreateUserRequest } from '@usecases/users/v1/create-user-use-case/interfaces/create-user-request'
import { MockProxy, mock } from 'jest-mock-extended'

export const createUserValidatorMock: MockProxy<
  RequestValidator<CreateUserRequest>
> &
  RequestValidator<CreateUserRequest> =
  mock<RequestValidator<CreateUserRequest>>()

export const createAuthenticationValidatorMock: MockProxy<
  RequestValidator<AuthenticateRequest>
> &
  RequestValidator<AuthenticateRequest> =
  mock<RequestValidator<AuthenticateRequest>>()

export const createCheckInValidatorMock: MockProxy<
  RequestValidator<CreateCheckInRequest>
> &
  RequestValidator<CreateCheckInRequest> =
  mock<RequestValidator<CreateCheckInRequest>>()

export const createGymValidatorMock: MockProxy<
  RequestValidator<CreateGymRequest>
> &
  RequestValidator<CreateGymRequest> =
  mock<RequestValidator<CreateGymRequest>>()
