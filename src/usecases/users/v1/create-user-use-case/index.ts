import { inject, injectable } from '@core/dependency-injection'
import { UserType } from '@entities/enums/user-type-enum'
import { User } from '@entities/user'
import { UseCaseCore } from '@usecases/core/use-case-core'
import { UserAlreadyExitsError } from '@usecases/errors'
import { UserRepository } from '@usecases/port/repositories'
import {
  EncryptionService,
  Logger,
  RequestValidator,
} from '@usecases/port/services'
import { UseCase } from '@usecases/port/use-case'
import { CreateUserRequest } from './interfaces/create-user-request'
import { CreateUserResponse } from './interfaces/create-user-response'

export interface CreateUserUseCase
  extends UseCase<CreateUserRequest, CreateUserResponse> {}

@injectable()
export class CreateUser
  extends UseCaseCore<CreateUserRequest>
  implements CreateUserUseCase
{
  constructor(
    @inject('Logger')
    private logger: Logger,
    @inject('UserRepository')
    private userRepository: UserRepository,
    @inject('EncryptionService')
    private encryptionService: EncryptionService,
    @inject('CreateUserValidator')
    validator: RequestValidator<CreateUserRequest>,
  ) {
    super(validator)
    this.logger.setContext(CreateUser.name)
  }

  private saveUser(user: User) {
    return this.userRepository.save(user)
  }

  private updateUser(user: User) {
    return this.userRepository.update(user)
  }

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      this.validate(request)
      const { email, name, password, type } = request

      this.logger.info(`Buscando usuário no banco de dados, email: ${email}.`)
      const userAlreadyExits = await this.userRepository.findOneByEmail(email)

      if (userAlreadyExits) {
        if (
          type === UserType.BUSINESS &&
          userAlreadyExits.getType() === UserType.NORMAL
        ) {
          this.logger.info(
            `Usuário ${userAlreadyExits.getId()} está criando uma conta comercial`,
          )

          userAlreadyExits.update({
            type: UserType.BUSINESS,
          })
          await this.updateUser(userAlreadyExits)

          this.logger.info('Salvando usuário no banco de dados.')
          return this.success({
            id: userAlreadyExits.getId(),
            name,
            email,
            type: userAlreadyExits.getType(),
            createdAt: userAlreadyExits.getCreatedAt(),
          })
        }

        this.logger.warn(`Usuário com email ${email} ja cadastrado no banco.`)
        return this.failure(new UserAlreadyExitsError())
      }

      const hashedPassword = await this.encryptionService.hash(password)

      this.logger.info('Salvando usuário no banco de dados.')
      const userCreated = await this.saveUser(
        User.from({
          email,
          password: hashedPassword,
          name,
          type: UserType[type],
        }),
      )

      this.logger.info('Usuário criado com sucesso.')
      return this.success({
        name,
        email,
        id: userCreated.getId(),
        type: userCreated.getType(),
        createdAt: userCreated.getCreatedAt(),
      })
    } catch (error) {
      this.logger.error('Erro ao criar usuario %o', this.formatError(error))
      return this.failure(error)
    }
  }
}
