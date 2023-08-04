import { checkInRepositoryMock } from '@tests/mocks/repositories.mock'
import { dateServiceMock, loggerServiceMock } from '@tests/mocks/services.mock'
import { fetchUserCheckInsHistoryValidatorMock } from '@tests/mocks/validators.mock'
import { mockReset } from 'jest-mock-extended'
import { InvalidDataError } from '@usecases/errors'
import {
  FetchUserCheckInsHistory,
  FetchUserCheckInsHistoryUseCase,
} from './index'
import { fetchUserCheckInsHistoryMock } from '@tests/mocks/check-in'
import { createFetchUserCheckInsHistoryMock } from '@tests/mocks/check-in/fetch-user-check-ins-history-request.mock'

describe('Fetch user check-ins history use case', () => {
  let useCase: FetchUserCheckInsHistoryUseCase
  beforeEach(() => {
    mockReset(checkInRepositoryMock)
    mockReset(loggerServiceMock)
    mockReset(fetchUserCheckInsHistoryValidatorMock)
    mockReset(dateServiceMock)
    useCase = new FetchUserCheckInsHistory(
      loggerServiceMock,
      dateServiceMock,
      checkInRepositoryMock,
      fetchUserCheckInsHistoryValidatorMock,
    )
  })

  describe('When usecase is callled', () => {
    it('should fetch a user check-ins following the filters with success', async () => {
      fetchUserCheckInsHistoryValidatorMock.validate.mockReturnValue({
        isValid: true,
      })
      checkInRepositoryMock.findManyByUserId.mockResolvedValue(
        fetchUserCheckInsHistoryMock(),
      )
      const request = createFetchUserCheckInsHistoryMock()

      const { isSuccess } = await useCase.execute(request)

      Reflect.deleteProperty(request, 'totalItemsPerPage')
      Reflect.deleteProperty(request, 'page')

      expect(isSuccess).toBeTruthy()
      expect(checkInRepositoryMock.findManyByUserId).toBeCalled()
      expect(checkInRepositoryMock.findManyByUserId).toBeCalledWith({
        ...request,
        skip: 0,
        take: 20,
      })
    })

    describe('and get a error because', () => {
      it('Validation request error', async () => {
        const request = createFetchUserCheckInsHistoryMock()

        fetchUserCheckInsHistoryValidatorMock.validate.mockReturnValue({
          isValid: false,
        })

        const { isSuccess, value } = await useCase.execute(request)

        expect(isSuccess()).not.toBeTruthy()
        expect(value).toBeInstanceOf(InvalidDataError)
        expect(checkInRepositoryMock.findManyByUserId).not.toBeCalled()
      })
    })
  })
})
