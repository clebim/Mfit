import { constructor } from './constructor'

export type InjectionToken<T = any> = string | symbol | constructor<T>
