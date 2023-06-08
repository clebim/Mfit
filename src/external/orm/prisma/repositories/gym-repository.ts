import { CheckIn, CheckInProperties } from '@entities/check-in'
import { Prisma } from '@prisma/client'
import { CheckInRepository } from '@usecases/port/repositories'
import { FindManyCheckInsOptions } from '@usecases/port/repositories/check-in-repository'
import { prismaClient } from '../index'

export class PrismaCheckInRepository implements CheckInRepository {
  async save(data: CheckIn): Promise<CheckIn> {
    const dto = data.toDTO()

    const newCheckIn = await prismaClient.checkIn.create({
      data: {
        userId: dto.userId,
        gymId: dto.gymId,
      },
    })

    return CheckIn.from(newCheckIn as CheckInProperties)
  }

  async findByUserIdOnDate(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CheckIn | null> {
    const checkIn = await prismaClient.checkIn.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    if (!checkIn) {
      return null
    }

    return CheckIn.from(checkIn)
  }

  async findManyByUserId(options: FindManyCheckInsOptions): Promise<CheckIn[]> {
    const { userId, startDate, endDate } = options
    const skip = options.skip ?? 0
    const take = options.take ?? 20

    const args: Prisma.CheckInFindManyArgs = {
      where: {
        userId,
      },
      skip,
      take,
    }

    if (startDate && endDate) {
      args.where.createdAt = {
        gte: startDate,
        lte: endDate,
      }
    }

    const checkIns = await prismaClient.checkIn.findMany(args)

    return checkIns.map((checkIn) => CheckIn.from(checkIn))
  }
}
