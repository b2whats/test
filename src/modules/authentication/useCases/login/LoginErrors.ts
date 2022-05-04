export class TwoFactorAuthenticationError extends Error {
  constructor(public field: string, message: string) {
    super(message)
    Object.setPrototypeOf(this, TwoFactorAuthenticationError.prototype)
  }
}