import { UserType } from '@entities/enums/user-type-enum'
import { User, UserProperties } from '@entities/user'
import { faker } from '@faker-js/faker'
import { changeValuesMock } from '@tests/helper'

export const createUserMock = (
  valueHasToBeReplaced?: Partial<UserProperties>,
  replaceInsideListObject = true,
): User =>
  User.from(
    changeValuesMock<UserProperties>(
      {
        name: faker.person.fullName(),
        id: faker.string.uuid(),
        password: faker.string.sample(36),
        email: faker.internet.email(),
        type: UserType.NORMAL,
        createdAt: faker.date.recent(),
      },
      valueHasToBeReplaced,
      replaceInsideListObject,
    ),
  )
