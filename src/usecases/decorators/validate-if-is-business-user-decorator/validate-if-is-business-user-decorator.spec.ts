import { faker } from '@faker-js/faker'
import { UserType } from '@prisma/client'
import { prismaMock } from '@tests/mocks/prisma.mock'
import { UseCaseClassMock } from '@tests/mocks/use-case-class.mock'
import { UserNotBusinessError } from '@usecases/errors/user/user-not-business-error'
import { mockReset } from 'jest-mock-extended'
import { ClassDoesNotExtendsUseCaseCore } from '../errors/class-does-not-extends-use-case-core'
import { validateIfIsBusinessUser } from './index'

jest.mock('@external/logger')

describe('Test validate if is business user decorator', () => {
  beforeEach(() => {
    mockReset(prismaMock)
  })

  describe('When @validateIfIsBusinessUserDecorator is called', () => {
    it('should validate if user type is business and call execute method', async () => {
      class Foo extends UseCaseClassMock {
        @validateIfIsBusinessUser()
        public async execute(...args: any) {
          return true
        }
      }

      const id = faker.string.uuid()

      prismaMock.user.findUnique.mockResolvedValue({
        name: faker.person.fullName(),
        id,
        password: faker.string.sample(36),
        email: faker.internet.email(),
        type: UserType.BUSINESS,
        createdAt: faker.date.recent(),
      } as any)

      const foo = new Foo()
      const response: any = await foo.execute({ userId: id })
      expect(response).toEqual(true)
      expect(prismaMock.user.findUnique).toBeCalledWith({
        where: {
          id,
        },
      })
    })

    it('should validate if user type is business with id in request and call execute method', async () => {
      class Foo extends UseCaseClassMock {
        @validateIfIsBusinessUser()
        public async execute(...args: any) {
          return true
        }
      }

      const id = faker.string.uuid()

      prismaMock.user.findUnique.mockResolvedValue({
        name: faker.person.fullName(),
        id,
        password: faker.string.sample(36),
        email: faker.internet.email(),
        type: UserType.BUSINESS,
        createdAt: faker.date.recent(),
      } as any)

      const foo = new Foo()
      const response: any = await foo.execute({ id })
      expect(response).toEqual(true)
      expect(prismaMock.user.findUnique).toBeCalledWith({
        where: {
          id,
        },
      })
    })

    it('should call find by email if send email in request and call a execute method', async () => {
      class Foo extends UseCaseClassMock {
        @validateIfIsBusinessUser({ findBy: 'email' })
        public async execute(...args: any) {
          return true
        }
      }

      const email = faker.internet.email()

      prismaMock.user.findUnique.mockResolvedValue({
        name: faker.person.fullName(),
        id: faker.string.uuid(),
        password: faker.string.sample(36),
        email,
        type: UserType.BUSINESS,
        createdAt: faker.date.recent(),
      } as any)

      const foo = new Foo()
      const response: any = await foo.execute({ email })
      expect(response).toEqual(true)
      expect(prismaMock.user.findUnique).toBeCalledWith({
        where: {
          email,
        },
      })
    })

    describe('and return a error because', () => {
      it('target class does not extends a useCaseCore', async () => {
        class Foo {
          @validateIfIsBusinessUser()
          public async execute(...args: any) {
            return true
          }
        }

        const foo = new Foo()
        expect(foo.execute()).rejects.toBeInstanceOf(
          ClassDoesNotExtendsUseCaseCore,
        )
      })

      it('the user is not the business type', async () => {
        class Foo extends UseCaseClassMock {
          @validateIfIsBusinessUser()
          public async execute(...args: any) {
            return true
          }
        }

        prismaMock.user.findUnique.mockResolvedValue({
          name: faker.person.fullName(),
          id: faker.string.uuid(),
          password: faker.string.sample(36),
          email: faker.internet.email(),
          type: UserType.NORMAL,
          createdAt: faker.date.recent(),
        } as any)

        const foo = new Foo()
        const response: any = await foo.execute({ userId: faker.string.uuid() })
        expect(response.value).toBeInstanceOf(UserNotBusinessError)
        expect(response.isFailure()).toBe(true)
      })
    })
  })
})
