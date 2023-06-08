import { Dictionary } from '../interfaces/dictionary'
import { InjectionToken } from '../interfaces/injection-token'
import { ParamInfo } from '../interfaces/param-info'

/**
 *  Symbol usado para se ter uma alocação de memoria exclusiva para o reflect,
 *  não sendo possivel o acesso sem o uso do Symbol
 */
export const INJECTION_TOKEN_METADATA_KEY = Symbol('injectionTokens')

// ClassDecorator
export const getParamInfo = (target: Function): ParamInfo[] => {
  /**
   * Obtem os parametros que estão na função contructor da classe;
   * Ex: [ [Function: Object], [Function: Object] ]
   */
  const params: any[] = Reflect.getMetadata('design:paramtypes', target) || []

  /**
   * Pega cada parametro dentro do array params e substitui pelo token
   * passado no decorator inject() e retorna;
   *
   * Ex: ['Exemplo1', 'Exemplo2']
   */
  const injectionTokens: Dictionary<InjectionToken<any>> =
    Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {}
  Object.keys(injectionTokens).forEach((key) => {
    params[+key] = injectionTokens[key]
  })

  return params
}

// ParamDecorator
export const defineInjectionTokenMetadata = (
  target: any,
  _: string | symbol | undefined,
  parameterIndex: number,
  token: InjectionToken,
) => {
  /**
   * Pega a posição do parametro e o token passado e adiciona em um objeto.
   * Apos isso define no metadata da classe o objeto construido.
   *
   * Ex: { '0': 'Exemplo1', '1': 'Exemplo2' }
   */
  const descriptors: Dictionary<InjectionToken<any>> =
    Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {}
  descriptors[parameterIndex] = token

  Reflect.defineMetadata(INJECTION_TOKEN_METADATA_KEY, descriptors, target)
}
