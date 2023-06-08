/* eslint-disable prettier/prettier */
import { User, UserProperties } from '@entities/user';
import { UserRepository } from '@usecases/port/repositories';
import { prismaClient } from '../index';

export class PrismaUserRepository implements UserRepository {
  async update(user: User): Promise<User> {
    const updatedUser = await prismaClient.user.update({
      where: {
        id: user.getId(),
      },
      data: user.toDTO()
    })

    return User.from(updatedUser as any)
  }

  async findOneById(id: string): Promise<User  | null> {
    const user = await prismaClient.user.findUnique({
      where: {
        id
      }
    })

    if(!user) {
      return null
    }

    return User.from(user as any)
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await prismaClient.user.findUnique({
      where: {
        email,
      }
    })

    if(!user) {
      return null
    }

    return User.from(user as any)
  }

  async save(data: User): Promise<User> {
    const newUser = await prismaClient.user.create({ data: data.toDTO()})

    return User.from(newUser as UserProperties)
  }
}
