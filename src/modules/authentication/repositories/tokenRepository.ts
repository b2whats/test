import { Token, TokenProps } from '../domain/Token'

export interface LocalTokenDataSource {
  get(): TokenProps | null
  set(data: TokenProps): void
  clean(): void
}

export interface ITokenRepository {
  getToken(): Token
  saveToken(token: Token): void
  cleanToken(): void
}