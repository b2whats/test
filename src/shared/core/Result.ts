export type Result<V, E> = Ok<V, E> | Err<V, E>

export const ok = <V, E = never>(value: V): Ok<V, E> => new Ok(value)

export const err = <V = never, E = unknown>(err: E): Err<V, E> => new Err(err)

export class Ok<V, E> {
  constructor(readonly value: V) {}

  isOk: true = true
  isErr: false = false

  map<T>(cb: (value: V) => T): Result<T, E> {
    return ok(cb(this.value))
  }

  mapErr<T>(cb: (error: E) => T): Result<V, T> {
    return ok(this.value)
  }
}

export class Err<V, E> {
  constructor(readonly value: E) {}

  isOk: false = false
  isErr: true = true

  map<T>(cb: (value: V) => T): Result<T, E> {
    return err(this.value)
  }

  mapErr<T>(cb: (error: E) => T): Result<V, T> {
    return err(cb(this.value))
  }
}