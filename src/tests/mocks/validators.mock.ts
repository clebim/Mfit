import { AuthenticateRequest } from '@usecases/authentication/authenticate/interfaces/authenticate-request'
import { CreateCheckInRequest } from '@usecases/check-in/create-check-in-use-case/interfaces/create-check-in-request'
import { FetchUserCheckInsHistoryRequest } from '@usecases/check-in/fetch-user-check-ins-history/interfaces/fetch-user-check-ins-history-request'
import { CreateGymRequest } from '@usecases/gym/v1/create-gym-use-case/interfaces/create-gym-request'
import { FetchNearbyGymsRequest } from '@usecases/gym/v1/fetch-nearby-gyms/interfaces/fetch-nearby-gyms-request'
import { SearchGymsRequest } from '@usecases/gym/v1/search-gyms/interfaces/search-gyms-request'
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

export const fetchUserCheckInsHistoryValidatorMock: MockProxy<
  RequestValidator<FetchUserCheckInsHistoryRequest>
> &
  RequestValidator<FetchUserCheckInsHistoryRequest> =
  mock<RequestValidator<FetchUserCheckInsHistoryRequest>>()

export const searchGymValidatorMock: MockProxy<
  RequestValidator<SearchGymsRequest>
> &
  RequestValidator<SearchGymsRequest> =
  mock<RequestValidator<SearchGymsRequest>>()

export const fetchNearByGymsValidatorMock: MockProxy<
  RequestValidator<FetchNearbyGymsRequest>
> &
  RequestValidator<FetchNearbyGymsRequest> =
  mock<RequestValidator<FetchNearbyGymsRequest>>()
