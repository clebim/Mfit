import {
  CheckInRepository,
  GymRepository,
  UserRepository,
} from '@usecases/port/repositories'
import { mock } from 'jest-mock-extended'

export const userRepositoryMock = mock<UserRepository>()
export const checkInRepositoryMock = mock<CheckInRepository>()
export const gymRepositoryMock = mock<GymRepository>()
