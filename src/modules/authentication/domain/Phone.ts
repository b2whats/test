import { ValueObject, ValidationError, ok, err } from '@shared/core/'

interface PhoneProps {
  raw: string
  formatted: string
}

export class Phone extends ValueObject<PhoneProps> {
  get raw(): string {
    return this.props.raw
  }

  get formatted(): string {
    return this.props.formatted
  }

  private constructor(props: PhoneProps) {
    super(props)
  }

  private static isValidPhone(phone: string) {
    return true
  }

  private static rawPhone(phone: string): string {
    return phone
  }

  public static create(phone: string) {
    if (!this.isValidPhone(phone)) {
      return err(new ValidationError('phone', 'Неверный номер телефона'))
    } else {
      return ok(
        new Phone({
          raw: this.rawPhone(phone),
          formatted: phone
        })
      )
    }
  }
}
