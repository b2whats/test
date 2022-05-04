import { TokenRepository, SessionStorageTokenSource } from './implementation/tokenRepository'
import { AuthRepository } from './implementation/authRepository'

const tokenRepo = new TokenRepository(new SessionStorageTokenSource())
const authRepo = new AuthRepository(fetch)

export { tokenRepo, authRepo }