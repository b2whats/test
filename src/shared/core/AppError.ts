class BaseError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = new.target.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class ValidationError extends BaseError {
  constructor(public field: string, message?: string) {
    super(message)
  }
}

export class UnexpectedError extends BaseError {
  constructor (error?: string) {
    super(error)

    console.log('[AppError]: An unexpected error occurred')
  }
}

