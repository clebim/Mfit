import { getParamInfo } from '../reflect-api'
import { constructor } from '../interfaces/constructor'
import { typeInfo } from '../core/type-info'

export const injectable = (): ClassDecorator => {
  return function (target: Function) {
    typeInfo.set(target as constructor<any>, getParamInfo(target))
  }
}
