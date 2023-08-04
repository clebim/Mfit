import { mockReset } from 'jest-mock-extended'
import { SearchGyms } from './index'
import { loggerServiceMock } from '@tests/mocks/services.mock'
import { gymRepositoryMock } from '@tests/mocks/repositories.mock'
import { searchGymValidatorMock } from '@tests/mocks/validators.mock'
import { faker } from '@faker-js/faker'
import { listGymsMock } from '@tests/mocks/gym/list-gyms.mock'
import { SearchGymsResponseData } from './interfaces/search-gyms-response'
import { InvalidDataError } from '@usecases/errors'

describe('Search Gyms Usecase', () => {
  let useCase: SearchGyms

  beforeEach(() => {
    mockReset(loggerServiceMock)
    mockReset(gymRepositoryMock)
    mockReset(searchGymValidatorMock)
    useCase = new SearchGyms(
      loggerServiceMock,
      gymRepositoryMock,
      searchGymValidatorMock,
    )
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('When usecase is called', () => {
    it('Should search gyms with user entered filters', async () => {
      const request = {
        userId: faker.string.uuid(),
        title: faker.string.alpha(),
      }

      searchGymValidatorMock.validate.mockReturnValue({ isValid: true })
      gymRepositoryMock.searchMany.mockResolvedValue(listGymsMock())
      const { isSuccess, value } = await useCase.execute(request)
      const { items } = value as SearchGymsResponseData

      Reflect.deleteProperty(request, 'userId')

      expect(isSuccess).toBeTruthy()
      expect(gymRepositoryMock.searchMany).toBeCalled()
      expect(gymRepositoryMock.searchMany).toBeCalledWith({
        ...request,
        skip: 0,
        order: 'DESC',
        orderBy: 'createdAt',
        take: 20,
      })
      expect(items.length).toEqual(6)
    })
    describe('and get a error because', () => {
      it('Validation request error', async () => {
        const request = {
          userId: faker.string.uuid(),
          title: faker.string.alpha(),
        }

        searchGymValidatorMock.validate.mockReturnValue({
          isValid: false,
        })

        const { isSuccess, value } = await useCase.execute(request)

        expect(isSuccess()).not.toBeTruthy()
        expect(value).toBeInstanceOf(InvalidDataError)
        expect(gymRepositoryMock.searchMany).not.toBeCalled()
      })
    })
  })
})
