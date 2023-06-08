import { Provider } from '../providers/provider'
import { RegistrationOptions } from './registration-options'

export type Registration<T = any> = {
  provider: Provider
  options: RegistrationOptions
  instance?: T
}
