import { Failure } from './failure'
import { Success } from './success'

export type Either<Error, Value> = Failure<Error, Value> | Success<Error, Value>

export const failure = <Error, Value>(value: Error): Either<Error, Value> =>
  new Failure<Error, Value>(value)
export const success = <Error, Value>(value?: Value): Either<Error, Value> =>
  new Success<Error, Value>(value)
