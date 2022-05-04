import type { Cache } from './Cache'
import { ObservableMap, MapEvent } from '@shared/emitter/ObservableMap'

type KnownKeys<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K]
}
export type StorageType = 'local' | 'session'
type WebStorage = KnownKeys<Storage>

type Options<Type> = {
  name: string
  type?: Type
}

export class WebStorageCache1<V = unknown> implements Cache<string, V> {
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
  apply(method: 'get', key: string): string | null
  apply(method: 'delete', key: string): void
  apply(method: 'set', key: string, value: V, storageType: StorageType): this
  apply(method: 'get' | 'set' | 'delete', key: string, value?: V, storageType?: StorageType): any {
    const storageKey = this.prefix + key
    let storage = this.keysStorageMap[storageKey] || this[storageType!]

    if (!storage) return null

    switch (method) {
      case 'get': {
        return storage.getItem(storageKey)
      }
      case 'set': {
        this.keysStorageMap[storageKey] = storage
        return storage.setItem(storageKey, JSON.stringify(value))
      }
      case 'delete': {
        delete this.keysStorageMap[storageKey]
        return storage.removeItem(storageKey)
      }

    }
  }

  get<Value extends V = V>(key: string): Value | undefined {
    const result = this.apply('get', key)

    return result === null ? undefined : JSON.parse(result)
  }

  getAll() {
    const result: Record<string, V> = {}

    this.forEach((key, value) => result[key] = value)

    return result
  }

  set(key: string, value: any, storageType: StorageType = this.storageType) {
    return this.apply('set', key, value, storageType)
  }

  has(key: string) {
    const result = this.apply('get', key)

    return result ? true : false
  }

  delete(key: string) {
    this.apply('delete', key)
  }

  forEach(cb: (key: string, value: V) => void) {
    for (const storageKey in this.keysStorageMap) {
      const key = storageKey.substring(this.prefix.length)
      const value = this.get(key)

      cb(key, value!)
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

export class WebStorageCache<V = unknown> extends ObservableMap<string, V> {
  private prefix: string

  constructor(name: string, private storage: WebStorage) {
    super()
    this.prefix = name + '-'
    this.recoverStorage()
    this.subscribe(this.onChange)
    this.subscribeWithStorageEvent()
  }

  private subscribeWithStorageEvent() {
    window.addEventListener('storage', (event) => {
      if (event.storageArea !== this.storage) return

      if (event.key === null || event.key.startsWith(this.prefix)) {
        this.unsubscribe(this.onChange)
        if (event.key === null) {
          super.clear()
        } else if (event.newValue === null) {
          super.delete(event.key)
        } else {
          try {
            super.set(event.key, JSON.parse(event.newValue))
          } catch (error) {
            console.error(error)
          }
        }
        this.subscribe(this.onChange)
      }
    })
  }

  private recoverStorage() {
    for (let i = 0; i < this.storage.length; i++) {
      const storageKey = this.storage.key(i)
  
      if (storageKey?.startsWith(this.prefix)) {
        const key = storageKey.substring(this.prefix.length)
        const value = this.storage.getItem(storageKey)!

        super.set(key, JSON.parse(value))
      }
    }
  }

  private onChange = (event: MapEvent): void => {
    switch (event.type) {
      case 'set': {
        this.storage.setItem(this.prefix + event.key, JSON.stringify(event.value))
        return
      }
      case 'delete': {
        this.storage.removeItem(this.prefix + event.key)
        return
      }
      case 'clear': {
        super.forEach((_, key) => this.storage.removeItem(this.prefix + key))
        return
      }
    }
  }
}

(window as any).S = WebStorageCache


const a = new WebStorageCache1({ name: ''})
const qq = a.get('dd')

const aa = new WebStorageCache('a', localStorage)
aa.get<string>('qq')