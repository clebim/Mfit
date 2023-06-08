import { InjectionToken } from '../interfaces/injection-token'

export abstract class RegistryBase<T = any> {
  protected registryMap = new Map<InjectionToken, T[]>()

  /**
   * Verifica se ja possui uma propriedade com key informada.
   * Se nao tiver cria uma nova propriedade no map.
   */
  private ensure(key: InjectionToken) {
    if (!this.registryMap.has(key)) {
      this.registryMap.set(key, [])
    }
  }

  public entries(): IterableIterator<[InjectionToken, T[]]> {
    return this.registryMap.entries()
  }

  public getAll(key: InjectionToken): T[] {
    this.ensure(key)
    return this.registryMap.get(key)!
  }

  public setAll(key: InjectionToken, value: T[]): void {
    this.registryMap.set(key, value)
  }

  public clear(): void {
    this.registryMap.clear()
  }

  public get(key: InjectionToken): T | null {
    this.ensure(key)
    const value = this.registryMap.get(key)!
    return value[value.length - 1] || null
  }

  public has(key: InjectionToken): boolean {
    this.ensure(key)
    return this.registryMap.get(key)!.length > 0
  }

  public set(key: InjectionToken, value: T): void {
    this.ensure(key)
    this.registryMap.get(key)!.push(value)
  }
}
