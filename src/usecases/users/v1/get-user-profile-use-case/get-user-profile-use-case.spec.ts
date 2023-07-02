import { faker } from '@faker-js/faker'
import { userRepositoryMock } from '@tests/mocks/repositories.mock'
import { loggerServiceMock } from '@tests/mocks/services.mock'
import { createUserMock } from '@tests/mocks/user'
import { mockReset } from 'jest-mock-extended'
import { GetUserProfile, GetUserProfileUseCase } from './index'

describe('CreateUserUseCase', () => {
  let useCase: GetUserProfileUseCase

  beforeEach(() => {
    mockReset(userRepositoryMock)
    mockReset(loggerServiceMock)
    useCase = new GetUserProfile(loggerServiceMock, userRepositoryMock)
  })

  describe('When usecase is called', () => {
    it('Should return a user', async () => {
      const request = {
        userId: faker.string.uuid(),
      }

      userRepositoryMock.findOneById.mockResolvedValue(createUserMock())

      const response = await useCase.execute(request)

      expect(userRepositoryMock.findOneById).toBeCalled()
      expect(userRepositoryMock.findOneById).toBeCalledWith(request.userId)
      expect(response.value).toHaveProperty('email')
      expect(response.value).not.toHaveProperty('password')
    })

    it('Should return a error because a fatal error', async () => {
      const request = {
        userId: faker.string.uuid(),
      }

      userRepositoryMock.findOneById.mockRejectedValue(new Error('Fatal error'))

      const response = await useCase.execute(request)

      expect(userRepositoryMock.findOneById).toBeCalled()
      expect(userRepositoryMock.findOneById).toBeCalledWith(request.userId)
      expect(response.isFailure()).toBeTruthy()
    })
  })
})
