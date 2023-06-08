import { CheckIn, CheckInProperties } from '@entities/check-in'
import { CheckInRepository } from '@usecases/port/repositories'
import { prismaClient } from '../index'

export class PrismaCheckInRepository implements CheckInRepository {
  async save(data: CheckIn): Promise<CheckIn> {
    const newCheckIn = await prismaClient.checkIn.create({
      data: {
        userId: data.toDTO().userId,
      },
    })

    return CheckIn.from(newCheckIn as CheckInProperties)
  }

  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn> {
    throw new Error('Method not implemented.')
  }

  findManyByUserId(userId: string): Promise<CheckIn[]> {
    throw new Error('Method not implemented.')
  }
}
