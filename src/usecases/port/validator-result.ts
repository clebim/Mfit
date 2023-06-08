export interface ValidatorResult<T> {
  isValid: boolean
  value?: T
  invalidFields?: any
}
