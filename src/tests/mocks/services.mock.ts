import { DateService, EncryptionService, Logger } from '@usecases/port/services'
import { MockProxy, mock } from 'jest-mock-extended'

export const loggerServiceMock: MockProxy<Logger> & Logger = mock<Logger>()

export const encryptionServiceMock: MockProxy<EncryptionService> &
  EncryptionService = mock<EncryptionService>()

export const dateServiceMock: MockProxy<DateService> & DateService =
  mock<DateService>()
