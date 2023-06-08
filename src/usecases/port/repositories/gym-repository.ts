import { Gym } from '@entities/gym'

export interface GymRepository {
  save(data: Gym): Promise<Gym>
  findById(id: string): Promise<Gym | undefined>
}
