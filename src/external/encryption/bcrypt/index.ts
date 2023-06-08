import { EncryptionService } from '@usecases/port/services'
import { compare, hash } from 'bcryptjs'

export class BcryptService implements EncryptionService {
  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = await compare(value, hash)

    return isValid
  }

  async hash(value: string): Promise<string> {
    const hashedValue = await hash(value, 6)

    return hashedValue
  }
}
