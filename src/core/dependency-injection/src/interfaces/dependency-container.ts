import { Provider } from '../providers/provider'
import { InjectionToken } from './injection-token'
import { RegistrationOptions } from './registration-options'

export interface DependencyContainerCore {
  register(
    token: InjectionToken,
    providerOrConstructor: Provider,
    options?: RegistrationOptions,
  ): DependencyContainerCore
  resolve<T>(token: InjectionToken): T
}
