/* eslint-disable no-useless-constructor */
import { Lifecycle } from '../enums/lifecycle'
import { formatErrorCtor } from '../errors/cannot-inject-helper'
import { constructor } from '../interfaces/constructor'
import { DependencyContainerCore } from '../interfaces/dependency-container'
import { InjectionToken } from '../interfaces/injection-token'
import { ParamInfo } from '../interfaces/param-info'
import { Registration } from '../interfaces/registration'
import { RegistrationOptions } from '../interfaces/registration-options'
import { isClassProvider } from '../providers/class-provider'
import { isProvider, Provider } from '../providers/provider'
import { isValueProvider } from '../providers/value-provider'
import { Registry } from './registry'
import { typeInfo } from './type-info'

export class DependencyContainer implements DependencyContainerCore {
  private registry = new Registry()

  public isRegistered<T>(token: InjectionToken<T>): boolean {
    return this.registry.has(token)
  }

  private getRegistration<T>(token: InjectionToken<T>): Registration | null {
    if (this.isRegistered(token)) {
      return this.registry.get(token)!
    }

    return null
  }

  /**
   * Função utilizada em um map feito no paramInfo.
   * paramInfo é as depencendias registradas para uma classe.
   *
   * Para cada registro dentro do paramInfo cria um instancia da dependencia encontrada
   * recursivamente. Pois se um registro tambem depende de outro registro, precisa-se resolver
   * essas instancias.
   */
  private resolveParams<T>(ctor: constructor<T>) {
    return (param: ParamInfo, index: number) => {
      try {
        return this.resolve(param)
      } catch (error) {
        throw new Error(formatErrorCtor(ctor, index, error as Error))
      }
    }
  }

  private construct<T>(
    ctor: constructor<T>, // [class Exemplo]
  ): T {
    // Realiza a construção da instancia.
    const instance: T = (() => {
      /**
       * Busca as dependencias que a classe necessita.
       * salvas pelo decorator injectable.
       *
       * Ex: ['Exemplo1', 'Exemplo2']
       */
      const paramInfo = typeInfo.get(ctor)

      /**
       * Verifica se a classe recebida possui dependencias registradas
       *
       * Se nao possui dependencias registradas pelo injectable decorator e a classe realmente nao possui
       * argumentos no constructor, retorna uma nova instancia da classe.
       *
       * Se nao possui dependendias registradas pelo injectable decorator mas possui argumentos no constructor
       * retorna um erro.
       */
      if (!paramInfo || paramInfo.length === 0) {
        if (ctor.length === 0) {
          // eslint-disable-next-line new-cap
          return new ctor()
        } else {
          throw new Error(`TypeInfo not known for "${ctor.name}"`)
        }
      }

      /**
       * Recebe todas as dependencias da classe resolvidas.
       */
      const params = paramInfo.map(this.resolveParams(ctor))

      /**
       * Cria uma nova instancia da classe com todas as suas depencias ja criadas
       * e resolvidas.
       */
      // eslint-disable-next-line new-cap
      return new ctor(...params)
    })()

    /**
     * Retorna a instancia da classe pronta para uso.
     */
    return instance
  }

  private resolveRegistration<T>(registration: Registration): T {
    const isSingleton = registration.options.lifecycle === Lifecycle.Singleton

    let resolved: T

    // Se for valor não necessita de instancia e ja retorna.
    if (isValueProvider(registration.provider)) {
      resolved = registration.provider.useValue
    } else if (isClassProvider(registration.provider)) {
      /**
       * Se for um singleton cria a instancia apenas uma vez e ja salva no parametro
       * instance e passa a retorna-lo.
       * Se não for singleton sempre criará a nova instancia.
       */
      resolved = isSingleton
        ? registration.instance ||
          (registration.instance = this.construct(
            registration.provider.useClass,
          ))
        : this.construct(registration.provider.useClass)
    } else {
      resolved = this.construct(registration.provider)
    }

    return resolved
  }

  public resolve<T>(token: InjectionToken<any>): T {
    // Busca a classe registrada com base no token.
    const registration = this.getRegistration(token)

    if (!registration) {
      throw new Error(
        `Attempted to resolve unregistered dependency token: "${token.toString()}"`,
      )
    }

    const result = this.resolveRegistration(registration) as T

    return result
  }

  /**
   * Registra um token para uma classe no map.
   */

  public register(
    token: InjectionToken,
    providerOrConstructor: Provider<any>,
    options: RegistrationOptions = { lifecycle: Lifecycle.Transient },
  ): DependencyContainer {
    let provider: Provider

    /**
     * Como possui 2 formas de chamar o método register
     * transforma os 2 formas de passar os parametros para apenas 1 forma
     */
    if (!isProvider(providerOrConstructor)) {
      provider = { useClass: providerOrConstructor }
    } else {
      provider = providerOrConstructor
    }

    /**
     * Se um value é passado como singleton retorna um erro.
     * Pois não é um classe.
     */
    if (options.lifecycle === Lifecycle.Singleton) {
      if (isValueProvider(provider)) {
        throw new Error(
          `Cannot use lifecycle "${
            Lifecycle[options.lifecycle]
          }" with ValueProviders`,
        )
      }
    }

    /**
     * Registra no map a classe e o token vinculado a ela.
     */
    this.registry.set(token, { provider, options })

    return this
  }
}
