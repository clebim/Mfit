import { UserType } from '@entities/enums/user-type-enum'
import { faker } from '@faker-js/faker'
import { userRepositoryMock } from '@tests/mocks/repositories.mock'
import {
  encryptionServiceMock,
  loggerServiceMock,
} from '@tests/mocks/services.mock'
import { createUserMock } from '@tests/mocks/user'
import { createUserValidatorMock } from '@tests/mocks/validators.mock'
import { InvalidDataError, UserAlreadyExitsError } from '@usecases/errors'
import { mockReset } from 'jest-mock-extended'
import { CreateUser, CreateUserUseCase } from './index'
import { CreateUserRequest } from './interfaces/create-user-request'

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase

  beforeEach(() => {
    mockReset(userRepositoryMock)
    mockReset(loggerServiceMock)
    mockReset(encryptionServiceMock)
    mockReset(createUserValidatorMock)
    useCase = new CreateUser(
      loggerServiceMock,
      userRepositoryMock,
      encryptionServiceMock,
      createUserValidatorMock,
    )
  })

  describe('When usecase is called', () => {
    it('Should validate if exists user with same email in database, hash user password and return it', async () => {
      const request: CreateUserRequest = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.string.alpha(8),
        type: UserType.NORMAL,
      }
      const hashedPassword = faker.string.sample(36)
      const userMock = createUserMock({
        ...request,
        id: undefined,
        createdAt: undefined,
        password: hashedPassword,
      })

      createUserValidatorMock.validate.mockReturnValue({ isValid: true })
      userRepositoryMock.findOneByEmail.mockResolvedValue(undefined)
      userRepositoryMock.save.mockResolvedValue(userMock)
      encryptionServiceMock.hash.mockResolvedValue(hashedPassword)

      const response = await useCase.execute(request)
      const { type } = response.value as any

      expect(encryptionServiceMock.hash).toBeCalled()
      expect(encryptionServiceMock.hash).toBeCalledWith(request.password)
      expect(userRepositoryMock.findOneByEmail).toBeCalled()
      expect(userRepositoryMock.findOneByEmail).toBeCalledWith(request.email)
      expect(userRepositoryMock.save).toBeCalled()
      expect(userRepositoryMock.save).toBeCalledWith(userMock)
      expect(response.value).toHaveProperty('id')
      expect(type).toEqual('NORMAL')
    })

    it('Should create a business user based on a existing user', async () => {
      const request: CreateUserRequest = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.string.alpha(8),
        type: UserType.BUSINESS,
      }
      const userMock = createUserMock({
        type: UserType.NORMAL,
      })

      createUserValidatorMock.validate.mockReturnValue({ isValid: true })
      userRepositoryMock.findOneByEmail.mockResolvedValue(userMock)
      userRepositoryMock.save.mockResolvedValue(userMock)

      const { value } = await useCase.execute(request)
      const { type } = value as any

      expect(encryptionServiceMock.hash).not.toBeCalled()
      expect(userRepositoryMock.findOneByEmail).toBeCalled()
      expect(userRepositoryMock.findOneByEmail).toBeCalledWith(request.email)
      expect(userRepositoryMock.update).toBeCalled()
      expect(userRepositoryMock.update).toBeCalledWith(userMock)
      expect(value).toHaveProperty('id')
      expect(type).toEqual('BUSINESS')
    })

    describe('And get a failure because', () => {
      it('User already exists in database', async () => {
        const request: CreateUserRequest = {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: faker.string.alpha(8),
          type: UserType.NORMAL,
        }

        createUserValidatorMock.validate.mockReturnValue({ isValid: true })
        userRepositoryMock.findOneByEmail.mockResolvedValue(createUserMock())

        const response = await useCase.execute(request)

        expect(encryptionServiceMock.hash).not.toBeCalled()
        expect(userRepositoryMock.findOneByEmail).toBeCalled()
        expect(userRepositoryMock.findOneByEmail).toBeCalledWith(request.email)
        expect(userRepositoryMock.save).not.toBeCalled()
        expect(response.value).toBeInstanceOf(UserAlreadyExitsError)
      })

      it('Invalid sent request', async () => {
        const request: CreateUserRequest = {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: faker.string.alpha(8),
          type: UserType.NORMAL,
        }

        createUserValidatorMock.validate.mockReturnValue({ isValid: false })

        const response = await useCase.execute(request)

        expect(encryptionServiceMock.hash).not.toBeCalled()
        expect(userRepositoryMock.findOneByEmail).not.toBeCalled()
        expect(userRepositoryMock.save).not.toBeCalled()
        expect(response.value).toBeInstanceOf(InvalidDataError)
      })
    })
  })
})
