import { Gym, GymProperties } from '@entities/gym'
import { faker } from '@faker-js/faker'
import { changeValuesMock } from '@tests/helper'

export const createGymMock = (
  valueHasToBeReplaced?: Partial<GymProperties>,
  replaceInsideListObject = true,
): Gym =>
  Gym.from(
    changeValuesMock<GymProperties>(
      {
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        title: faker.string.alpha(),
        phone: faker.string.alpha(),
        description: faker.string.alpha(),
        latitude: -18.9522447,
        longitude: -48.2891457,
        createdAt: faker.date.recent(),
      },
      valueHasToBeReplaced,
      replaceInsideListObject,
    ),
  )
