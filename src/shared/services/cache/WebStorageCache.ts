import { ObservableMap, ObservableMapEvent } from '../../utils/ObservableMap'
import type { Cache } from './Cache'

type KnownKeys<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K]
}
type WebStorage = KnownKeys<Storage>

const storageEventType = (event: StorageEvent)  => {
  if (event.key === null) return 'clear'
  else if (event.newValue === null) return 'delete'
  else return 'set'
}

const safeJsonParse = (data: any) => {
  let value = data
  try {
    value = JSON.parse(value)
  } catch (error) {}

  return value
}

export class WebStorageCacheMultiple<V = unknown> extends ObservableMap<string, V> implements Cache {
  private prefix: string

  constructor(prefix: string, private storage: WebStorage) {
    super()
    this.prefix = prefix + '-'
    this.recoverStorage()
    super.subscribe(this.onChange)
    window.addEventListener('storage', this.subscriberOnStorage)
  }

  private subscriberOnStorage = (event: StorageEvent) => {
    if (event.storageArea !== this.storage) return
    if (!(event.key === null || event.key.startsWith(this.prefix))) return
    if (event.key !== null && event.oldValue === event.newValue) return

    super.unsubscribe(this.onChange)

    const key = event.key?.substring(this.prefix.length)

    switch (storageEventType(event)) {
      case 'set': super.set(key!, safeJsonParse(event.newValue)); break
      case 'delete': super.delete(key!); break
      case 'clear': super.clear(); break
    }

    super.subscribe(this.onChange)
  }

  private recoverStorage() {
    for (let i = 0; i < this.storage.length; i++) {
      const storageKey = this.storage.key(i)
  
      if (storageKey?.startsWith(this.prefix)) {
        const key = storageKey.substring(this.prefix.length)
        let value = this.storage.getItem(storageKey)!

        super.set(key, safeJsonParse(value))
      }
    }
  }

  private onChange = (event: ObservableMapEvent): void => {
    switch (event.type) {
      case 'set': this.storage.setItem(this.prefix + event.key, JSON.stringify(event.value)); break
      case 'delete': this.storage.removeItem(this.prefix + event.key); break
      case 'clear': event.keys.forEach((key) => this.storage.removeItem(this.prefix + key)); break
    }
  }
}

export class WebStorageCacheSingle<V = unknown> extends ObservableMap<string, V> implements Cache {
  constructor(private name: string, private storage: WebStorage) {
    super()
    this.recoverStorage()
    super.subscribe(this.onChange)
    window.addEventListener('storage', this.subscriberOnStorage)
  }

  private subscriberOnStorage = (event: StorageEvent) => {
    if (event.storageArea !== this.storage) return
    if (!(event.key === null || event.key === this.name)) return
    if (event.key !== null && event.oldValue === event.newValue) return

    super.unsubscribe(this.onChange)

    switch (storageEventType(event)) {
      case 'set': super.fromString(event.newValue!); break
      case 'delete':
      case 'clear': super.clear(); break
    }

    super.subscribe(this.onChange)
  }

  private recoverStorage() {
    const data = this.storage.getItem(this.name)

    if (data) super.fromString(data)
  }

  private onChange = (event: ObservableMapEvent): void => {
    switch (event.type) {
      case 'set':
      case 'delete': this.storage.setItem(this.name, super.toString()); break
      case 'clear': this.storage.removeItem(this.name); break
    }
  }
}

export function webStorageCreate(prefix: string, type: 'persistence' | 'session' = 'persistence', strategy: 'single' | 'multiple' = 'single') {
  const storage = type === 'persistence' ? window.localStorage : window.sessionStorage

  return strategy === 'single'
    ? new WebStorageCacheSingle(prefix, storage)
    : new WebStorageCacheMultiple(prefix, storage)

}