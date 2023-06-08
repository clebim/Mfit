import { instanceToPlain, plainToInstance } from 'class-transformer'

export abstract class EntityFactory {
  static toDTO<Data>(data: Data): Record<string, any> {
    return instanceToPlain(data)
  }

  static from<Entity, Data>(entity: Class<Entity>, data: Data): Entity {
    return plainToInstance(entity, data)
  }
}
