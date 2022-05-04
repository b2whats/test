import { nanoid } from 'nanoid'

export class UniqueEntityID {
  private value

  constructor(id?: string | number) {
    this.value = id ? id : nanoid()
  }

  equals(id?: UniqueEntityID): boolean {
    if (id === null || id === undefined) return false

    return id.toValue() === this.value
  }

  toValue () {
    return this.value
  }
}