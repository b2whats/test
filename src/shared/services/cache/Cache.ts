export interface Cache<K extends string | number = string, V = unknown> {
  get(key: K): V | undefined
  set(key: K, value: V, ...args: [...any]): this
  has(key: K): boolean
  delete(key: K): void
  forEach(cb: (value: V, key: K) => void): void
  clear(): void
  readonly size: number
}