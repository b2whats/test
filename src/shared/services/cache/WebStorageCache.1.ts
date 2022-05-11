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
export class WebStorageCacheMultiple<V = unknown> extends ObservableMap<string, V> {
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

  private onChange = (event: MapEvent): void => {
    switch (event.type) {
      case 'set': this.storage.setItem(this.prefix + event.key, JSON.stringify(event.value)); break
      case 'delete': this.storage.removeItem(this.prefix + event.key); break
      case 'clear': event.keys.forEach((key) => this.storage.removeItem(this.prefix + key)); break
    }
  }
}
export class WebStorageCacheSingle<V = unknown> extends ObservableMap<string, V> {
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

  private onChange = (event: MapEvent): void => {
    switch (event.type) {
      case 'set':
      case 'delete': this.storage.setItem(this.name, super.toString()); break
      case 'clear': this.storage.removeItem(this.name); break
    }
  }
}

export type Feature<T = string> = {
  name: T
  active: boolean
  description?: string
}

export class FeatureToggleService<T extends string> extends WebStorageCacheSingle<boolean>{
  private localMap = new Map<T, boolean>()
  constructor(private featureList: Feature<T>[]) {
    super('featureToggle', window.localStorage)

    featureList.forEach(feature => {
      this.localMap.set(feature.name, feature.active)
      Object.defineProperty(feature, 'active', {
        get: () => this.get(feature.name)
      })
    })
  }

  get(featureName: T) {
    return !!(super.get(featureName) ?? this.localMap.get(featureName))
  }

  get list() {
    return this.featureList
  }

  toggle(featureName: T): void {
    const value = !this.get(featureName)
    super.set(featureName, value)
  }
}

type FeatureKeys = Parameters<(typeof featureToggle)['get']>[0]

export const useFeatures = (keys:  FeatureKeys | FeatureKeys[]) => {
  const forceUpdate = useReducer(() => ({}), {})[1]
  const features = useContext(FeatureTogglesContext)

  useEffect(() => {
    const list = ([] as any).concat(keys)

    const unsubscribe = features.subscribe((event) => {
      if (event.type === 'clear' || list.includes(event.key)) forceUpdate()
    })

    return () => unsubscribe
  }, [])

  return features
}


export const featureToggle = new FeatureToggleService([
  {
    name: 'test-on',
    active: true,
    description: 'Тестовый фича тогл, по умолчанию включен'
  },
  {
    name: 'MESSENGER_SIGNUP',
    active: false,
    description: 'Тестовый фича тогл, по умолчанию выключен'
  },
  {
    name: 'MESSENGER_PAYMENTS',
    active: false,
    description: 'Тестовый фича тогл, по умолчанию выключен'
  },
])

featureToggle.get('test-on')
const a = featureToggle.subscribe((arg) => {})