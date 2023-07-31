import { CheckIn } from '@entities/check-in'
import { FindManyOptions, FindManyRepositoryResponse } from './shared'

export type FindManyCheckInsOptions = {
  startDate?: Date
  endDate?: Date
  userId: string
} & FindManyOptions

export type FindManyCheckIns = {
  items: CheckIn[]
} & FindManyRepositoryResponse

export interface CheckInRepository {
  save(data: CheckIn): Promise<CheckIn>
  findByUserIdOnDate(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CheckIn | null>
  findManyByUserId(options: FindManyCheckInsOptions): Promise<FindManyCheckIns>
  countByUserId(userId: string): Promise<number>
}
