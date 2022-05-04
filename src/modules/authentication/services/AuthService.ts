import { Token } from '../domain/Token'

export interface AuthService {
  getToken(type?: 'access' | 'refresh'): Token | string | undefined
  refreshToken(): Promise<void>
  isAuthenticated(): boolean
  loginByPhone(phone: string): Promise<Token>
  logout(): Promise<void>
}