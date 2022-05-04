import { Token, TokenProps } from '../../domain/Token'
import type { ITokenRepository, LocalTokenDataSource } from '../tokenRepository'

export class SessionStorageTokenSource implements LocalTokenDataSource {
  private key = 'token'

  get() {
    const data = sessionStorage.getItem(this.key)

    if (data) return JSON.parse(data)

    return null
  }

  set(data: TokenProps) {
    sessionStorage.addItem(this.key, JSON.stringify(data))
  }

  clean() {
    sessionStorage.removeItem(this.key)
  }
}

export class TokenRepository implements ITokenRepository {
  token = Token.empty()
  constructor (private source: LocalTokenDataSource) {}

  getToken() {
    const tokenProps = this.source.get()

    if (tokenProps) {
      this.token.setToken(tokenProps)
    }

    return this.token
  }

  saveToken(token: Token): void {
    this.source.set(token.toPersistance())
  }

  cleanToken(): void {
    this.source.clean()
  }
}