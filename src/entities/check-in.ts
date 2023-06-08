import { Type } from 'class-transformer'
import { Entity } from './entity'
import { EntityFactory } from './factories/entity-factory'
import { Gym } from './gym'
import { User } from './user'

export interface CheckInProperties {
  id?: string
  userId: string
  gymId: string
  validateAt?: Date
  createdAt?: Date
  user?: User
  gym?: Gym
}

export class CheckIn extends Entity<CheckIn> {
  private id: string
  private userId: string
  private gymId: string
  private validateAt: Date
  private createdAt: Date
  @Type(() => User)
  private user: User

  @Type(() => Gym)
  private gym: Gym

  constructor() {
    super(CheckIn)
  }

  // Getters
  public getId(): string {
    return this.id
  }

  public getUserId(): string {
    return this.userId
  }

  public getGymId(): string {
    return this.gymId
  }

  public getValidateAt(): Date {
    return this.validateAt
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getUser(): User {
    return this.user
  }

  public getGym(): Gym {
    return this.gym
  }

  public update({ validateAt }: { validateAt: Date }) {
    this.validateAt = validateAt ?? this.validateAt
  }

  public toDTO() {
    return super.toDTO() as CheckInProperties
  }

  static from(dto: CheckInProperties): CheckIn {
    return EntityFactory.from(CheckIn, dto)
  }
}
