import { isObject } from '@shared/utils/is'
import { Observable } from '@shared/emitter/Observable'
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


