import { createFetchUserCheckInsHistoryMock } from '@tests/mocks/check-in/fetch-user-check-ins-history-request.mock'
import { checkInRepositoryMock } from '@tests/mocks/repositories.mock'
import { dateServiceMock, loggerServiceMock } from '@tests/mocks/services.mock'
import { fetchUserCheckInsHistoryValidatorMock } from '@tests/mocks/validators.mock'
import { mockReset } from 'jest-mock-extended'
import { FetchUserCheckInsHistory, FetchUserCheckInsHistoryUseCase } from '.'

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
    it('should fetch a user check-ins following the filters with sucess', async () => {
      const { isSuccess } = await useCase.execute(
        createFetchUserCheckInsHistoryMock(),
      )

      expect(isSuccess).toBeTruthy()
    })
  })
})
