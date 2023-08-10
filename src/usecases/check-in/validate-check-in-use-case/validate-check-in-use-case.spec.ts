import { dateServiceMock, loggerServiceMock } from '@tests/mocks/services.mock'
import { ValidateCheckIn, ValidateCheckInUseCase } from './index'
import {
  checkInRepositoryMock,
  gymRepositoryMock,
} from '@tests/mocks/repositories.mock'
import { mockReset } from 'jest-mock-extended'
import { faker } from '@faker-js/faker'
import { createChecInMock } from '@tests/mocks/check-in'
import { DateMethods } from '@usecases/port/services'
import { ValidateCheckInResponseData } from './interfaces/validate-check-in-response'
import { LateCheckInError } from '@usecases/errors/check-in/late-check-in-error'
import { CheckInNotFoundError } from '@usecases/errors/check-in/check-in-not-found-error'
import { InternalServerError } from '@usecases/errors'
import { createGymMock } from '@tests/mocks/gym'

jest.mock('@usecases/decorators', () => ({
  validateIfIsBusinessUser: () => jest.fn(),
}))

describe('Validate Check In usecase', () => {
  let useCase: ValidateCheckInUseCase

  beforeEach(() => {
    mockReset(loggerServiceMock)
    mockReset(checkInRepositoryMock)
    mockReset(dateServiceMock)
    useCase = new ValidateCheckIn(
      loggerServiceMock,
      checkInRepositoryMock,
      gymRepositoryMock,
      dateServiceMock,
    )
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('When usecase is callled', () => {
    it('should be able to validate checkIn before 20 minutes of its creation', async () => {
      const request = {
        userId: faker.string.uuid(),
        id: faker.string.uuid(),
      }
      const gymId = faker.string.uuid()
      const checkInMock = createChecInMock({
        createdAt: new Date('2023-08-09 19:15:00'),
        gymId,
      })
      const gymMock = createGymMock({
        userId: request.userId,
        id: gymId,
      })

      checkInRepositoryMock.findById.mockResolvedValue(checkInMock)
      gymRepositoryMock.findManyByUserId.mockResolvedValue([gymMock])
      dateServiceMock.diff.mockReturnValue(10)
      dateServiceMock.now.mockReturnValue({
        toDate: () => new Date(),
        format: () => new Date().toISOString(),
      } as DateMethods)

      const { isSuccess, value } = await useCase.execute(request)
      value as ValidateCheckInResponseData

      expect(isSuccess()).toBe(true)
      expect(value).toHaveProperty('validateAt')
      expect(checkInRepositoryMock.findById).toBeCalledWith(request.id)
      expect(gymRepositoryMock.findManyByUserId).toBeCalledWith(request.userId)
      expect(dateServiceMock.now).toBeCalled()
      expect(checkInRepositoryMock.findById).toBeCalled()
      expect(gymRepositoryMock.findManyByUserId).toBeCalled()
    })

    describe('And get a error because', () => {
      it('validate checkIn after 20 minutes of its creation', async () => {
        const request = {
          userId: faker.string.uuid(),
          id: faker.string.uuid(),
        }
        const gymId = faker.string.uuid()
        const checkInMock = createChecInMock({
          createdAt: new Date('2023-08-09 19:02:00'),
          gymId,
        })
        const gymMock = createGymMock({
          userId: request.userId,
          id: gymId,
        })

        checkInRepositoryMock.findById.mockResolvedValue(checkInMock)
        gymRepositoryMock.findManyByUserId.mockResolvedValue([gymMock])
        dateServiceMock.diff.mockReturnValue(24)

        const { isSuccess, value } = await useCase.execute(request)

        expect(isSuccess()).toBe(false)
        expect(value).toBeInstanceOf(LateCheckInError)
        expect(checkInRepositoryMock.findById).toBeCalledWith(request.id)
        expect(dateServiceMock.now).not.toBeCalled()
        expect(checkInRepositoryMock.findById).toBeCalled()
      })

      it('The gym of this checkIn does not belong to a userId', async () => {
        const request = {
          userId: faker.string.uuid(),
          id: faker.string.uuid(),
        }
        const gymId = faker.string.uuid()
        const checkInMock = createChecInMock({
          createdAt: new Date('2023-08-09 19:02:00'),
          gymId: faker.string.uuid(),
        })
        const gymMock = createGymMock({
          userId: request.userId,
          id: gymId,
        })

        checkInRepositoryMock.findById.mockResolvedValue(checkInMock)
        gymRepositoryMock.findManyByUserId.mockResolvedValue([gymMock])

        const { isSuccess, value } = await useCase.execute(request)

        expect(isSuccess()).toBe(false)
        expect(value).toBeInstanceOf(CheckInNotFoundError)
        expect(checkInRepositoryMock.findById).toBeCalledWith(request.id)
        expect(dateServiceMock.now).not.toBeCalled()
        expect(checkInRepositoryMock.findById).toBeCalled()
      })

      it('inexistent check In', async () => {
        const request = {
          userId: faker.string.uuid(),
          id: faker.string.uuid(),
        }

        checkInRepositoryMock.findById.mockResolvedValue(null)

        const { isSuccess, value } = await useCase.execute(request)

        expect(isSuccess()).toBe(false)
        expect(value).toBeInstanceOf(CheckInNotFoundError)
        expect(checkInRepositoryMock.findById).toBeCalledWith(request.id)
        expect(checkInRepositoryMock.findById).toBeCalled()
        expect(dateServiceMock.now).not.toBeCalled()
      })
      it('Internal server error', async () => {
        const request = {
          userId: faker.string.uuid(),
          id: faker.string.uuid(),
        }

        checkInRepositoryMock.findById.mockRejectedValue(
          new Error('Fatal error'),
        )

        const { isSuccess, value } = await useCase.execute(request)

        expect(isSuccess()).toBe(false)
        expect(value).toBeInstanceOf(InternalServerError)
        expect(checkInRepositoryMock.findById).toBeCalledWith(request.id)
        expect(checkInRepositoryMock.findById).toBeCalled()
        expect(dateServiceMock.now).not.toBeCalled()
      })
    })
  })
})
