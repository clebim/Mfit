import { faker } from '@faker-js/faker'
import { changeValuesMock } from '@tests/helper'
import { CreateGymRequest } from '@usecases/gym/v1/create-gym-use-case/interfaces/create-gym-request'

export const createGymRequestMock = (
  valueHasToBeReplaced?: Partial<CreateGymRequest>,
  replaceInsideListObject = true,
): CreateGymRequest =>
  changeValuesMock<CreateGymRequest>(
    {
      userId: faker.string.uuid(),
      title: faker.string.alpha(),
      phone: faker.string.alpha(),
      description: faker.string.alpha(),
      latitude: -18.9522447,
      longitude: -48.2891457,
    },
    valueHasToBeReplaced,
    replaceInsideListObject,
  )
