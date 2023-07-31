import { faker } from '@faker-js/faker'
import { createChecInMock } from '@tests/mocks/check-in'
import { createGymMock } from '@tests/mocks/gym'
import {
  checkInRepositoryMock,
  gymRepositoryMock,
} from '@tests/mocks/repositories.mock'
import { loggerServiceMock } from '@tests/mocks/services.mock'
import { createUserMock } from '@tests/mocks/user'
import { createCheckInValidatorMock } from '@tests/mocks/validators.mock'
import { InvalidDataError } from '@usecases/errors'
import { DistanceGreaterThanAllowedError } from '@usecases/errors/check-in/distance-greater-than-allowed-error'
import { GymNotFoundError } from '@usecases/errors/gym/gym-not-found-error'
import { mockReset } from 'jest-mock-extended'
import { CreateCheckIn, CreateCheckInUseCase } from './index'
import { CreateCheckInRequest } from './interfaces/create-check-in-request'

describe('Create check in use case', () => {
  let useCase: CreateCheckInUseCase

  beforeEach(() => {
    mockReset(loggerServiceMock)
    mockReset(checkInRepositoryMock)
    mockReset(gymRepositoryMock)
    mockReset(createCheckInValidatorMock)
    useCase = new CreateCheckIn(
      loggerServiceMock,
      checkInRepositoryMock,
      gymRepositoryMock,
      createCheckInValidatorMock,
    )
  })

  describe('When usecase is callled', () => {
    it(`Shoud validate distance to gym and if check in has
      already been made on the same day and return success
    `, async () => {
      const latitude = -18.9522447
      const longitude = -48.2891457

      const gymMock = createGymMock({
        latitude,
        longitude,
      })
      const userMock = createUserMock()
      const checkInMock = createChecInMock()

      const request: CreateCheckInRequest = {
        gymId: gymMock.getId(),
        userId: userMock.getId(),
        userLatitude: latitude,
        userLongitude: longitude,
      }

      createCheckInValidatorMock.validate.mockReturnValue({ isValid: true })
      gymRepositoryMock.findById.mockResolvedValue(gymMock)
      checkInRepositoryMock.findByUserIdOnDate.mockResolvedValue(undefined)
      checkInRepositoryMock.save.mockResolvedValue(checkInMock)
      jest.useFakeTimers({ now: new Date() })

      const { isSuccess, value } = await useCase.execute(request)

      expect(isSuccess()).toBeTruthy()
      expect(value).toHaveProperty('id')
      expect(checkInRepositoryMock.findByUserIdOnDate).toBeCalled()
      expect(checkInRepositoryMock.findByUserIdOnDate).toBeCalledWith(
        userMock.getId(),
        new Date(),
        new Date(),
      )
      expect(checkInRepositoryMock.save).toBeCalled()
      expect(gymRepositoryMock.findById).toBeCalled()
      expect(gymRepositoryMock.findById).toBeCalledWith(request.gymId)
    })

    describe('And get a error because', () => {
      it('Gym not found in database', async () => {
        const latitude = -18.9522447
        const longitude = -48.2891457

        const request: CreateCheckInRequest = {
          gymId: faker.string.uuid(),
          userId: faker.string.uuid(),
          userLatitude: latitude,
          userLongitude: longitude,
        }

        createCheckInValidatorMock.validate.mockReturnValue({ isValid: true })
        gymRepositoryMock.findById.mockResolvedValue(undefined)

        const { isSuccess, value } = await useCase.execute(request)

        expect(isSuccess()).not.toBeTruthy()
        expect(value).toBeInstanceOf(GymNotFoundError)
        expect(gymRepositoryMock.findById).toBeCalled()
        expect(checkInRepositoryMock.findByUserIdOnDate).not.toBeCalled()
        expect(checkInRepositoryMock.save).not.toBeCalled()
      })

      it('Make two check-ins on the same day', async () => {
        const latitude = -18.9522447
        const longitude = -48.2891457
        const userLatitude = -18.935189
        const userLongitude = -48.3054452
        const gymMock = createGymMock({
          latitude,
          longitude,
        })
        const request: CreateCheckInRequest = {
          gymId: faker.string.uuid(),
          userId: faker.string.uuid(),
          userLatitude,
          userLongitude,
        }

        createCheckInValidatorMock.validate.mockReturnValue({ isValid: true })
        gymRepositoryMock.findById.mockResolvedValue(gymMock)
        checkInRepositoryMock.findByUserIdOnDate.mockResolvedValue(undefined)

        const { isSuccess, value } = await useCase.execute(request)

        expect(isSuccess()).not.toBeTruthy()
        expect(value).toBeInstanceOf(DistanceGreaterThanAllowedError)
        expect(gymRepositoryMock.findById).toBeCalled()
        expect(checkInRepositoryMock.findByUserIdOnDate).toBeCalled()
        expect(checkInRepositoryMock.save).not.toBeCalled()
      })

      it('Invalid sent request', async () => {
        const request: CreateCheckInRequest = {
          gymId: '',
          userId: '',
          userLatitude: 32,
          userLongitude: 12,
        }

        createCheckInValidatorMock.validate.mockReturnValue({ isValid: false })

        const { isSuccess, value } = await useCase.execute(request)

        expect(isSuccess()).not.toBeTruthy()
        expect(value).toBeInstanceOf(InvalidDataError)
        expect(gymRepositoryMock.findById).not.toBeCalled()
        expect(checkInRepositoryMock.findByUserIdOnDate).not.toBeCalled()
        expect(checkInRepositoryMock.save).not.toBeCalled()
      })
    })
  })
})
