import { Gym } from '@entities/gym'
import { FindManyOptions, FindManyRepositoryResponse } from './shared'

export type FindManyGymsOptions = {
  title?: string
  phone?: string
  latitude?: number
  longitude?: number
} & FindManyOptions

export type FindManyGyms = {
  items: Gym[]
} & FindManyRepositoryResponse
export interface GymRepository {
  save(data: Gym): Promise<Gym>
  findById(id: string): Promise<Gym | undefined>
  searchMany(options: FindManyGymsOptions): Promise<FindManyGyms>
}
