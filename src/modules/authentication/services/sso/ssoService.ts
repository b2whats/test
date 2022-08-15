import { CacheManager } from '@shared/services/cache/'
import { UnexpectedError } from '@shared/core/AppError'
import { Token } from '../../domain/Token'
import { AuthService } from '../AuthService'

export interface AuthService1 {
  getToken(): Token
  refreshToken(): Promise<void>
  isAuthorize(): boolean
  loginByPhone(phone: string): Promise<Token>
  logout(): Promise<void>
}

export class SSOService extends CacheManager implements AuthService {
  constructor() {
    super({ name: 'sso' })
  }

  getToken(type: 'access' | 'refresh'): string | undefined
  getToken(): Token | undefined
  getToken(type?: any) {
    const token = this.getCache<Token>('token')

    if (token) {
      return type ? token[type] : token
    }
    return undefined
  }

  async refreshToken() {
    const result = await this.query('token',
      () => fetch('/sso/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken('access')}`
        },
        body: this.getToken('refresh')
      })
        .then<Token>((response) => {
          return response.json()
        }),
      { cache: 'session', invalidate: true }
    )

    if (result.isErr) {
      this.logout()
      
      throw result.value
    }
  }

  isAuthenticated() {
    return this.hasCache('token')
  }

  async logout() {
    if (this.isAuthenticated()) {
      await fetch('/sso/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken('access')}`
        }
      })
    }

    this.clearCache()
  }
}