import { CheckIn } from '@entities/check-in'

type FindManyOptions = {
  page?: number
  skip?: number
  take?: number
}

export type FindManyCheckInsOptions = {
  startDate?: Date
  endDate?: Date
  userId: string
} & FindManyOptions

export interface CheckInRepository {
  save(data: CheckIn): Promise<CheckIn>
  findByUserIdOnDate(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CheckIn | null>
  findManyByUserId(options: FindManyCheckInsOptions): Promise<CheckIn[]>
}
