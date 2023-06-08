import { Logger } from '@core/logger'
import { UserType } from '@entities/enums/user-type-enum'
import { User } from '@entities/user'
import { mFitContainer } from '@external/ioc'
import { UserNotBusinessError } from '@usecases/errors/user/user-not-business-error'
import { UserRepository } from '@usecases/port/repositories'
import { ClassDoesNotExtendsUseCaseCore } from '../errors/class-does-not-extends-use-case-core'

type ValidateIfIsBusinessUserProps = {
  findBy: 'email' | 'id'
}

export const validateIfIsBusinessUser = (
  props?: ValidateIfIsBusinessUserProps,
): MethodDecorator =>
  function (
    target: Object,
    _: string | symbol,
    descriptor: PropertyDescriptor,
  ): void {
    const originalValue = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const logger = mFitContainer.resolve<Logger>('Logger')
      try {
        const key = props?.findBy ?? 'id'

        if (
          !target.constructor.prototype.failure ||
          typeof target.constructor.prototype.failure !== 'function'
        ) {
          logger.error('Classe target não extende UseCaseCore')
          throw new ClassDoesNotExtendsUseCaseCore()
        }

        logger.setContext(`decorator:ValidateIfIsBusinessUser`)
        const repository =
          mFitContainer.resolve<UserRepository>('UserRepository')
        let user: User

        if (key === 'id') {
          if (args[0]?.userId) {
            user = await repository.findOneById(args[0].userId)
          } else {
            user = await repository.findOneById(args[0].id)
          }
        } else {
          user = await repository.findOneByEmail(args[0].email)
        }

        const userId = user!.getId()

        logger.info(`Validando se o usuário ${userId} é comercial`)

        if (user!.getType() !== UserType.BUSINESS) {
          logger.error(
            `Usuário nao comercial ${userId} tentando criar uma academia`,
          )

          return target.constructor.prototype.failure.apply(this, [
            new UserNotBusinessError(),
          ])
        }

        return originalValue!.apply(this, args)
      } catch (error) {
        if (error instanceof ClassDoesNotExtendsUseCaseCore) {
          throw error
        }
        logger.error('Erro ao validar se usuário é comercial %o', error)
        return target.constructor.prototype.failure.apply(this, [error])
      }
    }
  }
