import { UserType } from '@entities/enums/user-type-enum'
import { faker } from '@faker-js/faker'
import { userRepositoryMock } from '@tests/mocks/repositories.mock'
import {
  encryptionServiceMock,
  loggerServiceMock,
} from '@tests/mocks/services.mock'
import { createUserMock } from '@tests/mocks/user'
import { createAuthenticationValidatorMock } from '@tests/mocks/validators.mock'
import { InvalidDataError } from '@usecases/errors'
import { InvalidCredentialsError } from '@usecases/errors/authenticate/invalid-credentials-error'
import { mockReset } from 'jest-mock-extended'
import { Authenticate, AuthenticateUseCase } from '.'
import { AuthenticateRequest } from './interfaces/authenticate-request'

describe('Authenticate use case', () => {
  let useCase: AuthenticateUseCase

  beforeEach(() => {
    mockReset(userRepositoryMock)
    mockReset(loggerServiceMock)
    mockReset(encryptionServiceMock)
    mockReset(createAuthenticationValidatorMock)
    useCase = new Authenticate(
      loggerServiceMock,
      userRepositoryMock,
      encryptionServiceMock,
      createAuthenticationValidatorMock,
    )
  })

  describe('When usecase is called', () => {
    it('Should authenticate a user when sent email and password correctly', async () => {
      const request: AuthenticateRequest = {
        email: faker.internet.email(),
        password: faker.string.alpha(8),
        clientId: 'MOBILE',
      }
      const userMock = createUserMock()

      createAuthenticationValidatorMock.validate.mockReturnValue({
        isValid: true,
      })
      userRepositoryMock.findOneByEmail.mockResolvedValue(userMock)
      encryptionServiceMock.compare.mockResolvedValue(true)

      await useCase.execute(request)

      expect(encryptionServiceMock.compare).toBeCalled()
      expect(encryptionServiceMock.compare).toBeCalledWith(
        request.password,
        userMock.getPassword(),
      )
      expect(userRepositoryMock.findOneByEmail).toBeCalled()
      expect(userRepositoryMock.findOneByEmail).toBeCalledWith(request.email)
    })

    describe('And get a error because', () => {
      it('User does not have a business account', async () => {
        const request: AuthenticateRequest = {
          email: faker.internet.email(),
          password: faker.string.alpha(8),
          clientId: 'WEB',
        }
        const userMock = createUserMock({
          type: UserType.NORMAL,
        })

        createAuthenticationValidatorMock.validate.mockReturnValue({
          isValid: true,
        })
        userRepositoryMock.findOneByEmail.mockResolvedValue(userMock)

        const response = await useCase.execute(request)

        expect(encryptionServiceMock.compare).not.toBeCalled()
        expect(response.value).toBeInstanceOf(InvalidCredentialsError)
        expect(userRepositoryMock.findOneByEmail).toBeCalled()
        expect(userRepositoryMock.findOneByEmail).toBeCalledWith(request.email)
      })
      it('Invalid sent email', async () => {
        const request: AuthenticateRequest = {
          email: faker.internet.email(),
          password: faker.string.alpha(8),
          clientId: 'MOBILE',
        }

        createAuthenticationValidatorMock.validate.mockReturnValue({
          isValid: true,
        })
        userRepositoryMock.findOneByEmail.mockResolvedValue(undefined)

        const response = await useCase.execute(request)

        expect(encryptionServiceMock.compare).not.toBeCalled()
        expect(userRepositoryMock.findOneByEmail).toBeCalled()
        expect(userRepositoryMock.findOneByEmail).toBeCalledWith(request.email)
        expect(response.value).toBeInstanceOf(InvalidCredentialsError)
      })

      it('Invalid sent password', async () => {
        const request: AuthenticateRequest = {
          email: faker.internet.email(),
          password: faker.string.alpha(8),
          clientId: 'MOBILE',
        }
        const userMock = createUserMock()

        createAuthenticationValidatorMock.validate.mockReturnValue({
          isValid: true,
        })
        userRepositoryMock.findOneByEmail.mockResolvedValue(userMock)
        encryptionServiceMock.compare.mockResolvedValue(false)

        const response = await useCase.execute(request)

        expect(encryptionServiceMock.compare).toBeCalled()
        expect(encryptionServiceMock.compare).toBeCalledWith(
          request.password,
          userMock.getPassword(),
        )
        expect(userRepositoryMock.findOneByEmail).toBeCalled()
        expect(userRepositoryMock.findOneByEmail).toBeCalledWith(request.email)
        expect(response.value).toBeInstanceOf(InvalidCredentialsError)
      })

      it('Invalid sent request', async () => {
        const request: AuthenticateRequest = {
          email: faker.internet.email(),
          password: faker.string.alpha(8),
          clientId: 'MOBILE',
        }

        createAuthenticationValidatorMock.validate.mockReturnValue({
          isValid: false,
        })

        const response = await useCase.execute(request)

        expect(encryptionServiceMock.compare).not.toBeCalled()
        expect(userRepositoryMock.findOneByEmail).not.toBeCalled()
        expect(response.value).toBeInstanceOf(InvalidDataError)
      })
    })
  })
})
