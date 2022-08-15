import { Result, ok, err, ValueObject, Entity } from '@shared/core/'
import { isNumber, isString } from '@shared/utils/is'
import { TTLCache, Times } from './TTLCache'
import { WebStorageCache, StorageType } from './WebStorageCache2'
import * as C from './WebStorageCache'

console.log(C)

type CacheOptions = {
  name: string
  defaultTTL?: Times
}

type QueryOptions = {
  cache: Times | StorageType
  invalidate?: boolean
} | Times | StorageType

export class CacheManager {
  private memory: TTLCache
  private persistance: WebStorageCache
  private keysStorageMap: Record<string, TTLCache | WebStorageCache> = {}

  constructor(options: CacheOptions) {
    this.memory = new TTLCache({ ttl: options.defaultTTL })
    this.persistance = new WebStorageCache({ name: options.name })
  }

  getCache<V = unknown>(key: string): V | undefined {
    const storage = this.keysStorageMap[key]

    if (!storage) return undefined

    return storage.get<V>(key)
  }

  setCache<V>(key: string, value: V, strategy: Times | StorageType): void {
    let storage

    if (strategy === 'local' || strategy === 'session') {
      storage = this.persistance
      storage.set(key, value, strategy)
    } else {
      storage = this.memory
      storage.set(key, value, strategy)
    }

    this.keysStorageMap[key] = storage
  }

  deleteCache(key: string) {
    const storage = this.keysStorageMap[key]

    if (!storage) return

    storage.delete(key)
  }

  hasCache(key: string): boolean {
    const storage = this.keysStorageMap[key]

    return !!storage?.get(key)
  }

  clearCache() {
    this.memory.clear()
    this.persistance.clear()
  }

  async query<QueryReturn, QueryValue = Exclude<QueryReturn, Error>, QueryError = Extract<QueryReturn, Error>>(
    key: string,
    action: () => QueryReturn | Promise<QueryReturn>,
    options: QueryOptions
  ): Promise<Result<QueryValue, Error>> {    
    let value, cache, invalidate

    if (isString(options) || isNumber(options)) {
      cache = options
    } else {
      ({ cache, invalidate } = options)
    }

    if (invalidate) {
      this.deleteCache(key)
    } else {
      value = this.getCache<QueryValue>(key)

      if (value !== undefined) return ok(value)
    }

    try {
      value = await action() as unknown as QueryValue
    } catch (error: any) {
      return err(error)
    }

    this.setCache(key, value, cache)

    return ok(value)
  }
}

(async () => {
  const a = new CacheManager({ name: '' })
  
  const q = a.getCache<string>('ddd')
  const qq = a.setCache('ddd', {}, 11)
  const qqq = (await a.query('ddd', () => new Promise((r, re) => re(33)), '1h')).map(v => 1)

  if (qqq.isOk) {
    qqq
  }

})()
