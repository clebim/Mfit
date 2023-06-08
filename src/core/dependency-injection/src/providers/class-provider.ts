import { constructor } from '../interfaces/constructor'
import { Provider } from './provider'

export default interface ClassProvider<T> {
  useClass: constructor<T>
}

export function isClassProvider<T>(
  provider: Provider,
): provider is ClassProvider<any> {
  return !!(provider as ClassProvider<T>).useClass
}
