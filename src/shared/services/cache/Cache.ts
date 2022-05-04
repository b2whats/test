export interface Cache<K extends string | number = string, V = unknown> {
  get(key: K): V | undefined
  getAll(): Record<K, V>
  set(key: K, value: V, ...args: [...any]): this
  has(key: K): boolean
  delete(key: K): void
  forEach(cb: (key: K, value: V) => void): void
  clear(): void
  readonly size: number
}