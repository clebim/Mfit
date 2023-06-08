import { InvalidCredentialsError } from '@usecases/errors/authenticate/invalid-credentials-error'
import { Either } from '@usecases/helpers/either'

export type AuthenticateResponse = Either<
  InvalidCredentialsError,
  { accessToken: string }
>
