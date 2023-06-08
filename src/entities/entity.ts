import { Exclude } from 'class-transformer'
import { EntityFactory } from './factories/entity-factory'

export abstract class Entity<T> {
  @Exclude() private readonly entity: Class<T>

  protected constructor(entity: Class<T>) {
    this.entity = entity
  }

  toDTO() {
    return EntityFactory.toDTO(this)
  }

  clone(): T {
    return EntityFactory.from(this.entity, this.toDTO())
  }
}
