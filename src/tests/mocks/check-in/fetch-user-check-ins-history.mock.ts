import { CheckIn } from '@entities/check-in'
import { faker } from '@faker-js/faker'
import { changeValuesMock } from '@tests/helper'
import { FindManyCheckIns } from '@usecases/port/repositories/check-in-repository'

const createCheckInMock: CheckIn = CheckIn.from({
  gymId: faker.string.uuid(),
  userId: faker.string.uuid(),
  createdAt: faker.date.recent(),
  id: faker.string.uuid(),
  validateAt: faker.date.recent(),
})

export const fetchUserCheckInsHistoryMock = (
  valueHasToBeReplaced?: Partial<FindManyCheckIns>,
  replaceInsideListObject = true,
): FindManyCheckIns =>
  changeValuesMock<FindManyCheckIns>(
    {
      items: new Array(6).fill(null).map(() => createCheckInMock),
      count: 6,
    },
    valueHasToBeReplaced,
    replaceInsideListObject,
  )
