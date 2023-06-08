import { ValidatorResult } from '../validator-result';

export interface RequestValidator<T> {
  validate: (request: T) => ValidatorResult<T>;
}
