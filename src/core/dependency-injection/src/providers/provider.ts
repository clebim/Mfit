import { constructor } from '../interfaces/constructor'
import ClassProvider, { isClassProvider } from './class-provider'
import ValueProvider, { isValueProvider } from './value-provider'

export type Provider<T = any> =
  | ClassProvider<T>
  | ValueProvider<T>
  | constructor<T>

export function isProvider(provider: any): provider is Provider {
  return isClassProvider(provider) || isValueProvider(provider)
}
