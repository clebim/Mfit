import { RequestValidator } from '@usecases/port/services/request-validator'
import { CreateUserRequest } from '@usecases/users/v1/create-user-use-case/interfaces/create-user-request'
import Joi from 'joi'
import { JoiValidator } from '../index'

export class CreateUserRequestValidator
  extends JoiValidator<CreateUserRequest>
  implements RequestValidator<CreateUserRequest>
{
  constructor() {
    const requestSchema = Joi.object<CreateUserRequest>({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      type: Joi.string().valid('NORMAL', 'BUSINESS').required(),
    }).required()

    super(requestSchema)
  }
}
