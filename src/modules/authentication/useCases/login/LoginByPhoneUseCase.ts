import { UseCase, Result, ValidationError } from '@shared/core/'
import { Phone } from '../../domain/Phone'
import { Token } from '../../domain/Token'
import { ITokenRepository } from '../../repositories/tokenRepository'
import { IAuthRepository } from '../../repositories/authRepository'

export interface LoginByPhoneDTO {
  phone: string
}

type Response = Result<
  Token,
  string | ValidationError
>

export class LoginByPhoneUseCase implements UseCase<LoginByPhoneDTO, Response> {
  private authRepo: IAuthRepository
  private tokenRepo: ITokenRepository

  constructor (authRepo: IAuthRepository, tokenRepo: ITokenRepository) {
    this.authRepo = authRepo
    this.tokenRepo = tokenRepo
  }

  async execute (request: LoginByPhoneDTO): Promise<Response> {
    let token: Token
    let phone: Phone

    const phoneOrError = Phone.create(request.phone)

    if (phoneOrError.isErr) return phoneOrError

    phone = phoneOrError.unwrap()

    const tokenOrError = await this.authRepo.loginByPhone(phone.raw)

    if (tokenOrError.isErr) {
      return tokenOrError
    }

    token = tokenOrError.unwrap()
    this.tokenRepo.saveToken(token)

    return tokenOrError
  }
}