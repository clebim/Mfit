import { Gym } from '@entities/gym'
import { faker } from '@faker-js/faker'
import { changeValuesMock } from '@tests/helper'
import { FindManyGyms } from '@usecases/port/repositories/gym-repository'

const createGymMock: Gym = Gym.from({
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  title: faker.string.alpha(),
  phone: faker.string.alpha(),
  description: faker.string.alpha(),
  latitude: -18.9522447,
  longitude: -48.2891457,
  createdAt: faker.date.recent(),
})

export const listGymsMock = (
  valueHasToBeReplaced?: Partial<FindManyGyms>,
  replaceInsideListObject = true,
): FindManyGyms =>
  changeValuesMock<FindManyGyms>(
    {
      items: new Array(6).fill(null).map(() => createGymMock),
      count: 6,
    },
    valueHasToBeReplaced,
    replaceInsideListObject,
  )
