import { RequestValidator } from '@usecases/port/services/request-validator'
import { ValidatorResult } from '@usecases/port/validator-result'
import Joi, { ObjectSchema, ValidationOptions } from 'joi'

export class JoiValidator<Request> implements RequestValidator<Request> {
  private readonly bodySchema: ObjectSchema<Request>

  private readonly validationOptions: ValidationOptions

  constructor(
    bodySchema: ObjectSchema<Request>,
    validationOptions?: ValidationOptions,
  ) {
    this.bodySchema = bodySchema
    this.validationOptions = {
      abortEarly: false,
      ...validationOptions,
    }
  }

  public validate(request: Request): ValidatorResult<Request> {
    const validationResult: ValidatorResult<Request> = {
      isValid: false,
    }

    const { error, value } = this.bodySchema.validate(
      request,
      this.validationOptions,
    )

    if (error) {
      const invalidFiels = error.details.reduce(
        (field: Joi.ValidationErrorItem, detail: Joi.ValidationErrorItem) => {
          const key = detail.path.join('.')
          const message = detail.message.replace(/['"]/g, '')
          Object.assign(field, { [key]: message })
          return field
        },
        {} as Joi.ValidationErrorItem,
      )

      validationResult.invalidFields = invalidFiels
      return validationResult
    }

    validationResult.isValid = true
    validationResult.value = value

    return validationResult
  }
}
