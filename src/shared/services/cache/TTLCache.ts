import { debounce } from '../../utils/debounce'
import type { Cache } from './Cache'

const now = () => Date.now()
const isPosInt = (n: any): n is number => n && n === Math.floor(n) && n > 0 && isFinite(n)

export type Times = `${number}s` | `${number}m` | `${number}h` | number

type Options<TTL> = {
  max?: number
  ttl?: TTL
}

export class TTLCache<V = unknown, TTL extends Times = never> implements Cache<string, V> {
  private expirations: Record<number, string[]> = {}
  private expirationMap = new Map<string, number>()
  private ttl: number | undefined
  private max: number
  private storage = new Map<string, V>()

  static timeToMs = (time?: Times) => {
    if (time === undefined) return
    if (typeof time === 'number') return time
  
    const [_, size, type] = time.split(/(\d+)/)
  
    switch (type) {
      case('s'): return parseInt(size) * 1000
      case('m'): return parseInt(size) * 1000 * 60
      case('h'): return parseInt(size) * 1000 * 60 * 60
      default: return undefined
    }
  }

  static msToTime = (time: number) => {
    const ms = time % 1000
    time = (time - ms) / 1000
    const secs = time % 60
    time = (time - secs) / 60
    const mins = time % 60
    const hrs = (time - mins) / 60
  
    return hrs + ':' + mins + ':' + secs + '.' + ms
  }

  constructor({ max = Infinity, ttl }: Options<TTL> = {}) {
    if (ttl !== undefined) {
      const TTLms = TTLCache.timeToMs(ttl)
      if (!isPosInt(TTLms)) throw new TypeError('ttl must be positive value or Times if set')

      this.ttl = TTLms
    }
    
    if (!isPosInt(max) && max !== Infinity) {
      throw new TypeError('max must be positive integer or Infinity')
    }
    this.max = max

    this.purgeStale = debounce(this.purgeStale.bind(this), 200, true)
  }

  clear() {
    this.expirationMap.forEach((_, key) => {
      const val = this.storage.get(key)!
      this.storage.delete(key)
      this.dispose(key, val, 'delete')
    })
    this.expirationMap.clear()
    this.expirations = {}
  }

  set(
    key: string,
    val: V,
    ...ttl: ([TTL] extends [never] ? [Times] : [])
  ) {
    const TTLms = ttl[0] ? TTLCache.timeToMs(ttl[0]) : this.ttl
    if (!isPosInt(TTLms)) {
      throw new TypeError('ttl must be positive integer')
    }
    const current = this.expirationMap.get(key)
    const time = now()

    if (current !== undefined) {
      const exp = this.expirations[current]
      if (!exp || exp.length <= 1) {
        delete this.expirations[current]
      } else {
        this.expirations[current] = exp.filter(k => k !== key)
      }
    }

    const expiration = Math.ceil(time + TTLms)
    this.expirationMap.set(key, expiration)
    const oldValue = this.storage.get(key)
    this.storage.set(key, val)

    oldValue && this.dispose(key, oldValue, 'set')

    if (!this.expirations[expiration]) {
      this.expirations[expiration] = []
    }

    this.expirations[expiration].push(key)

    setTimeout(() => this.purgeStale(), TTLms)

    while (this.size > this.max) {
      this.purgeToCapacity()
    }

    return this
  }

  has(key: string) {
    return this.storage.has(key)
  }

  getRemainingTTL(key: string) {
    const expiration = this.expirationMap.get(key)
    return expiration !== undefined ? TTLCache.msToTime(Math.max(0, expiration - now())) : 0
  }

  get<Value extends V = V>(key: string): Value | undefined {
    const val = this.storage.get(key)

    return val as Value
  }

  getAll() {
    return Object.fromEntries(this.storage)
  }

  dispose(key: string, value: V, status: 'set' | 'delete' | 'evict' | 'stale'): void {
    console.log(key, value, status)
  }

  delete(key: string) {
    const current = this.expirationMap.get(key)

    if (current === undefined) return 

    const val = this.storage.get(key)!
    this.storage.delete(key)
    this.expirationMap.delete(key)
    this.dispose(key, val, 'delete')
    const exp = this.expirations[current]

    if (exp && exp.length <= 1) {
      delete this.expirations[current]
    } else {
      this.expirations[current] = exp.filter(k => k !== key)
    }
  }

  private purgeToCapacity() {
    for (const exp in this.expirations) {
      const keys = this.expirations[exp]

      if (this.size - keys.length >= this.max) {
        for (const key of keys) {
          const val = this.storage.get(key)!
          this.storage.delete(key)
          this.expirationMap.delete(key)
          this.dispose(key, val, 'evict')
        }

        delete this.expirations[exp]
      } else {
        const s = this.size - this.max
        for (const key of keys.splice(0, s)) {
          const val = this.storage.get(key)!
          this.storage.delete(key)
          this.expirationMap.delete(key)
          this.dispose(key, val, 'evict')
        }
      }
      return
    }
  }

  get size() {
    return this.expirationMap.size
  }

  private purgeStale () {
    const n = now()
    for (const exp in this.expirations) {
      if (parseInt(exp) > n) {
        return
      }

      for (const key of this.expirations[exp]) {
        const val = this.storage.get(key)!
        this.storage.delete(key)
        this.expirationMap.delete(key)
        this.dispose(key, val, 'stale')
      }

      delete this.expirations[exp]
    }
  }

  forEach(cb: (key: string, value: V) => void) {
    this.storage.forEach((value, key) => cb(key, value))
  }
}


const q = new TTLCache()
const rr = q.get<string>('ddd')