import { createGymMock } from '@tests/mocks/gym'
import { createGymRequestMock } from '@tests/mocks/gym/create-gym-request.mock'
import {
  gymRepositoryMock,
  userRepositoryMock,
} from '@tests/mocks/repositories.mock'
import { loggerServiceMock } from '@tests/mocks/services.mock'
import { createUserMock } from '@tests/mocks/user'
import { createGymValidatorMock } from '@tests/mocks/validators.mock'
import { mockReset } from 'jest-mock-extended'
import { CreateGym, CreateGymUseCase } from './index'

jest.mock('@usecases/decorators', () => ({
  validateIfIsBusinessUser: () => jest.fn(),
}))

describe('Create gym usecase', () => {
  let useCase: CreateGymUseCase

  beforeEach(() => {
    mockReset(loggerServiceMock)
    mockReset(gymRepositoryMock)
    mockReset(userRepositoryMock)
    mockReset(createGymValidatorMock)
    useCase = new CreateGym(
      loggerServiceMock,
      gymRepositoryMock,
      createGymValidatorMock,
    )
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('When usecase is called', () => {
    it('Should create a new gym for a business user', async () => {
      const user = createUserMock()

      const request = createGymRequestMock({
        userId: user.getId(),
      })

      createGymValidatorMock.validate.mockReturnValue({ isValid: true })
      gymRepositoryMock.save.mockResolvedValue(
        createGymMock({
          userId: user.getId(),
        }),
      )

      const response = await useCase.execute(request)

      expect(response.isSuccess()).toBeTruthy()
      expect(response.value).toHaveProperty('id')
    })

    it('Return failure because a Fatal error', async () => {
      const user = createUserMock()

      const request = createGymRequestMock({
        userId: user.getId(),
      })

      createGymValidatorMock.validate.mockReturnValue({ isValid: true })
      gymRepositoryMock.save.mockRejectedValue(new Error())

      const response = await useCase.execute(request)
      const { isFailure, isSuccess } = response
      const value: any = response.value

      expect(isSuccess()).not.toBeTruthy()
      expect(isFailure()).toBeTruthy()
      expect(value).toBeInstanceOf(Error)
      expect(value.message).toEqual('Internal server error')
    })
  })
})
