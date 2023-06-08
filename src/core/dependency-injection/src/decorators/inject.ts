/* eslint-disable */
import { defineInjectionTokenMetadata } from '../reflect-api'
import { InjectionToken } from '../interfaces/injection-token'

export const inject = (token: InjectionToken<any>): ParameterDecorator => {
  return function (...args) {
    return defineInjectionTokenMetadata(
     ...args,
      token,
    )
  }
}
