import { CheckIn } from '@entities/check-in'

export interface CheckInRepository {
  save(data: CheckIn): Promise<CheckIn>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | undefined>
  findManyByUserId(userId: string): Promise<CheckIn[]>
}
