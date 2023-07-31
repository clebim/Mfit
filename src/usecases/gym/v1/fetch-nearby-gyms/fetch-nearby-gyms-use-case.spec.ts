import { loggerServiceMock } from '@tests/mocks/services.mock'
import { FetchNearbyGyms } from './index'
import { gymRepositoryMock } from '@tests/mocks/repositories.mock'
import { fetchNearByGymsValidatorMock } from '@tests/mocks/validators.mock'
import { mockReset } from 'jest-mock-extended'
import { faker } from '@faker-js/faker'
import { listGymsMock } from '@tests/mocks/gym/list-gyms.mock'
import { FetchNearbyGymsResponseData } from './interfaces/fetch-neaerby-gyms-response'
import { InvalidDataError } from '@usecases/errors'

describe('Fetch NearBy Gyms Usecase', () => {
  let useCase: FetchNearbyGyms

  beforeEach(() => {
    mockReset(loggerServiceMock)
    mockReset(gymRepositoryMock)
    mockReset(fetchNearByGymsValidatorMock)
    useCase = new FetchNearbyGyms(
      loggerServiceMock,
      gymRepositoryMock,
      fetchNearByGymsValidatorMock,
    )
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('When usecase is called', () => {
    it('Should fetch nearBy gyms based in user location', async () => {
      const request = {
        userId: faker.string.uuid(),
        userLatitude: -18.9522447,
        userLongitude: -48.2891457,
      }

      fetchNearByGymsValidatorMock.validate.mockReturnValue({ isValid: true })
      gymRepositoryMock.findManyNearBy.mockResolvedValue(listGymsMock().items)
      const { isSuccess, value } = await useCase.execute(request)
      const { gyms } = value as FetchNearbyGymsResponseData

      Reflect.deleteProperty(request, 'userId')

      expect(isSuccess).toBeTruthy()
      expect(gymRepositoryMock.findManyNearBy).toBeCalled()
      expect(gymRepositoryMock.findManyNearBy).toBeCalledWith({
        ...request,
      })
      expect(gyms.length).toEqual(6)
    })
    describe('and get a error because', () => {
      it('Validation request error', async () => {
        const request = {
          userId: faker.string.uuid(),
          userLatitude: -18.9522447,
          userLongitude: -48.2891457,
        }

        fetchNearByGymsValidatorMock.validate.mockReturnValue({
          isValid: false,
        })

        const { isSuccess, value } = await useCase.execute(request)

        expect(isSuccess()).not.toBeTruthy()
        expect(value).toBeInstanceOf(InvalidDataError)
        expect(gymRepositoryMock.findManyNearBy).not.toBeCalled()
      })
    })
  })
})
