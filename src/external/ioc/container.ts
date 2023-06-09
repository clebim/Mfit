import { CreateUserController } from '@adapters/controllers/v1/users/create-user-controller'
import { MomentDateService } from '@external/date/moment'
import { BcryptService } from '@external/encryption/bcrypt'
import { MfitLogger } from '@external/logger'
import { prismaClient } from '@external/orm/prisma'
import { PrismaUserRepository } from '@external/orm/prisma/repositories/user-repository'
import { CreateUserRequestValidator } from '@external/validators/joi-validator/create-user-validator'
import { CreateUser } from '@usecases/users/v1/create-user-use-case'
import { DependencyContainer, Lifecycle } from '../../core/dependency-injection'

export const mFitContainer = new DependencyContainer()

// CONTROLLERS
mFitContainer.register('CreateUserController', CreateUserController, {
  lifecycle: Lifecycle.Singleton,
})

// REPOSITORIES
mFitContainer.register('UserRepository', PrismaUserRepository, {
  lifecycle: Lifecycle.Singleton,
})

// VALIDATORS
mFitContainer.register('CreateUserValidator', CreateUserRequestValidator, {
  lifecycle: Lifecycle.Singleton,
})

// SERVICES
mFitContainer.register('PrismaClient', {
  useValue: prismaClient,
})

mFitContainer.register('Logger', MfitLogger, {
  lifecycle: Lifecycle.Singleton,
})

mFitContainer.register('EncryptionService', BcryptService, {
  lifecycle: Lifecycle.Singleton,
})

mFitContainer.register('DateService', MomentDateService, {
  lifecycle: Lifecycle.Singleton,
})

// USECASES
mFitContainer.register('CreateUserUseCase', CreateUser, {
  lifecycle: Lifecycle.Singleton,
})
