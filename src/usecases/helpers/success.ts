import { Failure } from './failure'

export class Success<Error, Value> {
  readonly value?: Value

  constructor(value?: Value) {
    this.value = value
  }

  isSuccess(): this is Success<Error, Value> {
    return true
  }

  isFailure(): this is Failure<Error, Value> {
    return false
  }
}
