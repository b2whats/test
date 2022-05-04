import { ok, err, UnexpectedError } from '@shared/core/'
import { Token } from '../../domain/Token'
import { Phone } from '../../domain/Phone'
import type { IAuthRepository } from '../authRepository'

export class AuthRepository implements IAuthRepository {
  constructor (private fetch: any) {}

  async loginByPhone(phone: string) {
    try {
      const token = await this.fetch('/sso/phone', { phone })
      const tokenOrError = Token.create(token)
      if (tokenOrError.isOk) {
        return tokenOrError.unwrap()
      } else {
        throw new Error('')
      }
    } catch(error) {
      throw new UnexpectedError(error)
    }
  }

  async logout() {
    try {
      await this.fetch('/sso/logout')

      return ok(void 0)
    } catch(error) {
      return err(new UnexpectedError(error))
    }
  }
}