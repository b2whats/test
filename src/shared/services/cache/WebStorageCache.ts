import type { Cache } from './Cache'

type KnownKeys<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K]
}
export type StorageType = 'local' | 'session'
type WebStorage = KnownKeys<Storage>

type Options<Type> = {
  name: string
  type?: Type
}

export class WebStorageCache<V = unknown> implements Cache<string, V> {
  private prefix: string
  private storageType: StorageType
  protected local: WebStorage
  protected session: WebStorage
  private keysStorageMap: Record<string, WebStorage> = {}

  constructor({ name , type = 'local' }: Options<StorageType>) {
    this.prefix = name + '-'
    this.storageType = type
    this.local = window.localStorage
    this.session = window.sessionStorage
    this.recoverStorageKeys('session')
    this.recoverStorageKeys('local')
  }

  private recoverStorageKeys(type: StorageType) {
    for (let i = 0; i < this[type].length; i++) {
      const storageKey = this[type].key(i)
  
      if (storageKey?.startsWith(this.prefix)) {
        this.keysStorageMap[storageKey] = this[type]
      }
    }
  }

  apply(method: 'get' | 'set' | '') {

  }

  get<Value extends V = V>(key: string): Value | undefined {
    const storageKey = this.prefix + key
    const storage = this.keysStorageMap[storageKey]

    if (!storage) return undefined

    const value = storage.getItem(storageKey)
    return value === null ? undefined : JSON.parse(value)
  }

  getAll() {
    const result: Record<string, V> = {}

    this.forEach((key, value) => {
      result[key] = value
    })

    return result
  }

  set(key: string, value: any, storageType: StorageType = this.storageType) {
    const storageKey = this.prefix + key
    const storage = this.keysStorageMap[storageKey] = this[storageType]
    storage.setItem(storageKey, JSON.stringify(value))

    return this
  }

  has(key: string) {
    const storageKey = this.prefix + key
    const storage = this.keysStorageMap[storageKey]

    return storage ? !!storage.getItem(storageKey) : false
  }

  delete(key: string) {
    const storageKey = this.prefix + key
    const storage = this.keysStorageMap[storageKey]

    if (!storage) return

    delete this.keysStorageMap[storageKey]

    return storage.removeItem(storageKey)
  }

  forEach(cb: (key: string, value: V) => void) {
    for (const storageKey in this.keysStorageMap) {
      const key = storageKey.substring(this.prefix.length)
      const value = this.get(key)!

      cb(key, value)
    }
  }

  clear() {
    for (const storageKey in this.keysStorageMap) {
      const storage = this.keysStorageMap[storageKey]

      storage.removeItem(storageKey)
    }
  }

  get size() {
    let count = 0

    for (const _ in this.keysStorageMap) {
      count++
    }
    
    return count
  }
}


const a = new WebStorageCache({ name: ''})
const qq = a.get('dd')