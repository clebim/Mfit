import { faker } from '@faker-js/faker'
import { changeValuesMock } from '@tests/helper'
import { FetchUserCheckInsHistoryRequest } from '@usecases/check-in/fetch-user-check-ins-history-use-case/interfaces/fetch-user-check-ins-history-request'

export const createFetchUserCheckInsHistoryMock = (
  valueHasToBeReplaced?: Partial<FetchUserCheckInsHistoryRequest>,
  replaceInsideListObject = true,
): FetchUserCheckInsHistoryRequest =>
  changeValuesMock<FetchUserCheckInsHistoryRequest>(
    {
      userId: faker.string.uuid(),
      endDate: faker.date.future(),
      startDate: faker.date.past(),
      order: 'DESC',
      orderBy: 'createdAt',
      page: 1,
      totalItemsPerPage: 20,
    },
    valueHasToBeReplaced,
    replaceInsideListObject,
  )
