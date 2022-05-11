import { isObject } from '@shared/utils/is'
import { Observable } from '@shared/emitter/Observable'
import { ObservableMap } from '@shared/emitter/ObservableMap'
import { WebStorageCache } from '@shared/services/cache/WebStorageCache.1'

export type Feature<T = string> = {
  name: T
  active: boolean
  description?: string
}

export class FeatureToggleService<T extends string> extends Observable<Record<T, boolean>>{
  private storageKey = 'featureToggle'
  private featureMap = {} as Record<T, boolean>

  constructor(private featureList: Feature<T>[]) {
    super()
    this.featuresToMap()
    this.syncWithStorage()

    window.addEventListener('storage', (event) => {
      if ([null, this.storageKey].includes(event.key)) this.syncWithStorage()
    })
  }

  private featuresToMap() {
    this.featureList.reduce((acc, item) => {
      acc[item.name] = item.active

      return acc
    }, this.featureMap)
  }

  private syncWithStorage() {
    const storageMap = JSON.parse(localStorage.getItem(this.storageKey) || '')

    if (!isObject(storageMap)) {
      this.featuresToMap()
    } else {
      Object.assign(this.featureMap, storageMap)
    }
  }

  has(featureName: T): boolean {
    return !!this.featureMap[featureName]
  }

  getAll() {
    return this.featureList
  }

  get(featureName: T): Feature | undefined {
    return this.featureList.find((element => element.name === featureName))
  }

  toggle(featureName: T): void {
    const value = this.has(featureName)
    this.featureMap[featureName] = !value

    localStorage.setItem(this.storageKey, JSON.stringify(this.featureMap))
    this.emit(this.featureMap)
  }
}

export class FeatureToggleService1<T extends string> extends Observable<Record<T, boolean>>{
  private storageKey = 'featureToggle'
  private featureMap = {} as Record<T, boolean>

  constructor(private featureList: Feature<T>[]) {
    super()
    this.featuresToMap()
    this.syncWithStorage()

    window.addEventListener('storage', (event) => {
      if ([null, this.storageKey].includes(event.key)) this.syncWithStorage()
    })
  }

  private featuresToMap() {
    this.featureList.reduce((acc, item) => {
      acc[item.name] = item.active

      return acc
    }, this.featureMap)
  }

  private syncWithStorage() {
    const storageMap = JSON.parse(localStorage.getItem(this.storageKey) || '')

    if (!isObject(storageMap)) {
      this.featuresToMap()
    } else {
      Object.assign(this.featureMap, storageMap)
    }
  }

  has(featureName: T): boolean {
    return !!this.featureMap[featureName]
  }

  getAll() {
    return this.featureList
  }

  get(featureName: T): Feature | undefined {
    return this.featureList.find((element => element.name === featureName))
  }

  toggle(featureName: T): void {
    const value = this.has(featureName)
    this.featureMap[featureName] = !value

    localStorage.setItem(this.storageKey, JSON.stringify(this.featureMap))
    this.emit(this.featureMap)
  }
}

export class FeatureToggleService3<V = unknown> extends ObservableMap<string, V> {
  constructor(private name: string, private storage: Storage) {
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

featureToggle.has('test-on')
const a = featureToggle.subscribe((arg) => {})


abstract class A {
  abstract test(): any
}



class B implements A {

}