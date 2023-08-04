import { checkInRepositoryMock } from '@tests/mocks/repositories.mock'
import { loggerServiceMock } from '@tests/mocks/services.mock'
import { mockReset } from 'jest-mock-extended'
import { GetUserMetrics, GetUserMetricsUseCase } from './index'
import { faker } from '@faker-js/faker'
import { InternalServerError } from '@usecases/errors'

describe('Get user check-ins metrics use case', () => {
  let useCase: GetUserMetricsUseCase
  beforeEach(() => {
    mockReset(checkInRepositoryMock)
    mockReset(loggerServiceMock)
    useCase = new GetUserMetrics(loggerServiceMock, checkInRepositoryMock)
  })

  describe('When usecase is callled', () => {
    it('should count a user check-ins with success', async () => {
      const count = faker.number.int({ min: 80 })
      const userId = faker.string.uuid()
      checkInRepositoryMock.countByUserId.mockResolvedValue(count)

      const { isSuccess, value } = await useCase.execute({ userId })

      expect(isSuccess).toBeTruthy()
      expect(checkInRepositoryMock.countByUserId).toBeCalled()
      expect(checkInRepositoryMock.countByUserId).toBeCalledWith(userId)
      expect(value).toEqual({ checkInsCount: count })
    })

    describe('and get a error because', () => {
      it('Fatal error in repository', async () => {
        const userId = faker.string.uuid()
        checkInRepositoryMock.countByUserId.mockRejectedValue(
          new Error('connection not found'),
        )

        const { isFailure, value } = await useCase.execute({ userId })

        expect(isFailure).toBeTruthy()
        expect(checkInRepositoryMock.countByUserId).toBeCalled()
        expect(checkInRepositoryMock.countByUserId).toBeCalledWith(userId)
        expect(value).toBeInstanceOf(InternalServerError)
      })
    })
  })
})
