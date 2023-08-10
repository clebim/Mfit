import { GymRepository } from '@usecases/port/repositories'
import {
  FindManyGymsOptions,
  FindManyGyms,
  FindManyNearByProps,
} from '@usecases/port/repositories/gym-repository'

import { prismaClient } from '../index'
import { Gym as PrismaGym } from '@prisma/client'
import { Gym, GymProperties } from '@entities/gym'

export class PrismaGymRepository implements GymRepository {
  async findManyNearBy(props: FindManyNearByProps): Promise<Gym[]> {
    const { userLatitude, userLongitude } = props

    const gyms = await prismaClient.$queryRaw<PrismaGym[]>`
      SELECT * from gyms
      WHERE (6371 * acos(cos(radians(${userLatitude})) * cos(radians( latitude ))
      * cos(radians( longitude ) - radians(${userLongitude}))
      + sin(radians(${userLatitude}))
      * sin(radians( latitude )))) <= 10`

    return gyms.map((gym) => Gym.from(gym as unknown as GymProperties))
  }

  async save(data: Gym): Promise<Gym> {
    const dto = data.toDTO()

    const newGym = await prismaClient.gym.create({
      data: {
        latitude: dto.latitude,
        longitude: dto.longitude,
        title: dto.title,
        phone: dto.phone,
        userId: dto.userId,
        description: dto.description,
      },
    })

    return Gym.from(newGym as unknown as GymProperties)
  }

  async findById(id: string): Promise<Gym> {
    const gym = await prismaClient.gym.findUnique({
      where: {
        id,
      },
    })
    return Gym.from(gym as unknown as GymProperties)
  }

  async searchMany(options: FindManyGymsOptions): Promise<FindManyGyms> {
    const { title } = options

    const args = {
      where: {
        title: {
          contains: title,
        },
      },
    }

    const [gyms, count] = await prismaClient.$transaction([
      prismaClient.gym.findMany(args),
      prismaClient.gym.count({
        where: args.where,
      }),
    ])

    return {
      items: gyms.map((gym) => Gym.from(gym as unknown as GymProperties)),
      count,
    }
  }

  async findManyByUserId(userId: string): Promise<Gym[]> {
    const gyms = await prismaClient.gym.findMany({
      where: {
        userId,
      },
    })
    return gyms.map((gym) => Gym.from(gym as unknown as GymProperties))
  }
}
