import { CheckIn, CheckInProperties } from '@entities/check-in'
import { faker } from '@faker-js/faker'
import { changeValuesMock } from '@tests/helper'

export const createChecInMock = (
  valueHasToBeReplaced?: Partial<CheckInProperties>,
  replaceInsideListObject = true,
): CheckIn =>
  CheckIn.from(
    changeValuesMock<CheckInProperties>(
      {
        id: faker.string.uuid(),
        gymId: faker.string.uuid(),
        userId: faker.string.uuid(),
        validateAt: null,
        createdAt: faker.date.recent(),
      },
      valueHasToBeReplaced,
      replaceInsideListObject,
    ),
  )
