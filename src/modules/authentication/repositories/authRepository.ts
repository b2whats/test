import { Result, UnexpectedError, Err } from '@shared/core/'
import { Token } from '../domain/Token'

export interface IAuthRepository {
  loginByPhone(phone: string): Promise<Token>
  logout(): Promise<Result<void, UnexpectedError>>
}