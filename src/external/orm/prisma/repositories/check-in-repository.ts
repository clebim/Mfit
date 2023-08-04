import { CheckIn, CheckInProperties } from '@entities/check-in'
import { Prisma } from '@prisma/client'
import { CheckInRepository } from '@usecases/port/repositories'
import {
  FindManyCheckIns,
  FindManyCheckInsOptions,
} from '@usecases/port/repositories/check-in-repository'
import { prismaClient } from '../index'

export class PrismaCheckInRepository implements CheckInRepository {
  async findById(id: string): Promise<CheckIn> {
    const checkIn = await prismaClient.checkIn.findUnique({
      where: {
        id,
      },
    })

    if (!checkIn) {
      return null
    }

    return CheckIn.from(checkIn)
  }

  async countByUserId(userId: string): Promise<number> {
    const count = await prismaClient.checkIn.count({
      where: {
        userId,
      },
    })
    return count
  }

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

  async findManyByUserId(
    options: FindManyCheckInsOptions,
  ): Promise<FindManyCheckIns> {
    const { userId, startDate, endDate, skip, take, order, orderBy } = options

    const args: Prisma.CheckInFindManyArgs = {
      where: {
        userId,
      },
      skip,
      take,
      orderBy: {
        [orderBy]: {
          sort: order.toLowerCase(),
        },
      },
    }

    if (startDate && endDate) {
      args.where.createdAt = {
        gte: startDate,
        lte: endDate,
      }
    }

    if (startDate && !endDate) {
      args.where.createdAt = {
        gte: startDate,
      }
    }

    if (!startDate && endDate) {
      args.where.createdAt = {
        lte: endDate,
      }
    }

    const [checkIns, count] = await prismaClient.$transaction([
      prismaClient.checkIn.findMany(args),
      prismaClient.checkIn.count({
        where: args.where,
      }),
    ])

    return {
      items: checkIns.map((checkIn) => CheckIn.from(checkIn)),
      count,
    }
  }
}
