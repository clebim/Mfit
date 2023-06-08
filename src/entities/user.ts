import { Type } from 'class-transformer'
import { CheckIn } from './check-in'
import { Entity } from './entity'
import { UserType } from './enums/user-type-enum'
import { EntityFactory } from './factories/entity-factory'

export interface UserProperties {
  id?: string
  name: string
  password: string
  email: string
  type: UserType
  createdAt?: Date
}

export interface UpdateUserProperties {
  name: string
  password: string
  email: string
  type: UserType
}

export class User extends Entity<User> {
  private id: string
  private name: string
  private email: string
  private password: string
  private type: UserType
  private createdAt: Date
  @Type(() => CheckIn)
  private checkIns: CheckIn[]

  constructor() {
    super(User)
  }

  public getId(): string {
    return this.id
  }

  public getName(): string {
    return this.name
  }

  public getEmail(): string {
    return this.email
  }

  public getPassword(): string {
    return this.password
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getCheckIns(): CheckIn[] {
    return this.checkIns
  }

  public getType() {
    return this.type
  }

  public update(data: Partial<UpdateUserProperties>) {
    this.email = data.email ?? this.email
    this.name = data.name ?? this.name
    this.password = data.password ?? this.password
    this.type = data.type ?? this.type
  }

  public toDTO() {
    return super.toDTO() as UserProperties
  }

  static from(dto: UserProperties): User {
    return EntityFactory.from(User, dto)
  }
}
