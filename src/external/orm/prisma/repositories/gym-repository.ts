import { Gym } from '@entities/gym'
import { GymRepository } from '@usecases/port/repositories'
import {
  FindManyGymsOptions,
  FindManyGyms,
} from '@usecases/port/repositories/gym-repository'

export class PrismaGymRepository implements GymRepository {
  save(data: Gym): Promise<Gym> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<Gym> {
    throw new Error('Method not implemented.')
  }

  searchMany(options: FindManyGymsOptions): Promise<FindManyGyms> {
    throw new Error('Method not implemented.')
  }
}
