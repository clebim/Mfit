import { Type } from 'class-transformer'
import { CheckIn } from './check-in'
import { Entity } from './entity'
import { EntityFactory } from './factories/entity-factory'
import { User } from './user'

export interface GymProperties {
  id?: string
  title: string
  description?: string
  phone: string
  latitude: number
  longitude: number
  createdAt?: Date
  checkIns?: CheckIn[]
  userId: string
  user?: User
}

export interface GymUpdateroperties {
  title: string
  description?: string
  phone: string
  latitude: number
  longitude: number
}

export class Gym extends Entity<Gym> {
  private id: string
  private title: string
  private description?: string
  private phone: string
  private latitude: number
  private longitude: number
  private userId: string
  private createdAt: Date
  @Type(() => CheckIn)
  private checkIns: CheckIn[]

  @Type(() => User)
  private user: User

  constructor() {
    super(Gym)
  }

  // Getters
  public getId(): string {
    return this.id
  }

  public getTitle(): string {
    return this.title
  }

  public getDescription(): string {
    return this.description
  }

  public getPhone(): string {
    return this.phone
  }

  public getLatitude(): number {
    return this.latitude
  }

  public getLongitude(): number {
    return this.longitude
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getCheckIns(): CheckIn[] {
    return this.checkIns
  }

  public getUser(): User {
    return this.user
  }

  public getUserId(): string {
    return this.userId
  }

  public update(data: GymUpdateroperties) {
    this.title = data.title ?? this.title
    this.description = data.description ?? this.description
    this.latitude = data.latitude ?? this.latitude
    this.longitude = data.longitude ?? this.longitude
    this.phone = data.phone ?? this.phone
  }

  public toDTO() {
    return super.toDTO() as GymProperties
  }

  static from(dto: GymProperties): Gym {
    return EntityFactory.from(Gym, dto)
  }
}
