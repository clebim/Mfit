/* eslint-disable prettier/prettier */
import { User } from '@entities/user';

export interface UserRepository {
  save(user: User): Promise<User>
  update(user: User): Promise<User>
  findOneByEmail(email: string): Promise<User | undefined>
  findOneById(id: string): Promise<User | undefined>
}
