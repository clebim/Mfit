/* eslint-disable prettier/prettier */
import { User } from '@entities/user';

export interface UserRepository {
  save(user: User): Promise<User>
  update(user: User): Promise<User>
  findOneByEmail(email: string): Promise<User | null>
  findOneById(id: string): Promise<User | null>
}
