import { LoginByPhoneUseCase } from './LoginByPhoneUseCase'
import { tokenRepo, authRepo } from '../../repositories'

const loginByPhone = new LoginByPhoneUseCase(authRepo, tokenRepo)

export { loginByPhone }