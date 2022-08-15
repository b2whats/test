import { WebStorageCacheSingle } from '../cache/WebStorageCache'

type Feature<T = string> = {
  name: T
  active: boolean
  description?: string
}

export class FeatureToggleService<T extends string = string> extends WebStorageCacheSingle<boolean>{
  private localMap = new Map<string, boolean>()

  constructor(private featureList: Feature<T>[], storage: Storage) {
    super('featureToggle', storage)

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
    super.set(featureName, !this.get(featureName))
  }
}