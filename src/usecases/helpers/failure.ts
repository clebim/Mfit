import { Success } from './success'

export class Failure<Error, Value> {
  readonly value: Error

  constructor(value: Error) {
    this.value = value
  }

  isSuccess(): this is Success<Error, Value> {
    return false
  }

  isFailure(): this is Failure<Error, Value> {
    return true
  }
}
