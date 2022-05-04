export abstract class ValueObject<T extends Record<string, any>> {
  public props: T

  constructor(props: T) {
    this.props = { ...props }
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) return false
    if (vo.props === undefined) return false

    return JSON.stringify(this.props) === JSON.stringify(vo.props)
  }

  toJSON(): T {
    return this.props
  }

  toString(): string {
    return JSON.stringify(this.props)
  }
}