import { ObservableMap, ObservableMapEvent } from '../../utils/ObservableMap'
import type { Cache } from './Cache'

export type Times = `${number}s` | `${number}m` | `${number}h` | `${number}ms`

const timeToMs = (time: Times) => {  
  const [_, size, type] = time.split(/(\d+)/)

  switch (type) {
    case('ms'): return parseInt(size)
    case('s'): return parseInt(size) * 1000
    case('m'): return parseInt(size) * 1000 * 60
    case('h'): return parseInt(size) * 1000 * 60 * 60
    default: throw new Error('time argument not valid')
  }
}

const msToTime = (time: number) => {
  var ms = time % 1000
  var s = Math.floor((time / 1000) % 60)
  var m = Math.floor((time / (60 * 1000)) % 60)
  var h = Math.floor((time / (24 * 60 * 1000)) % 60)

  return `${h}:${m}:${s}.${ms}`
}
export class TTLCache<V = unknown, TTL extends Times = never> extends ObservableMap<string, V> implements Cache {
  private expirationTimeoutMap = new Map<string, number>()
  private time: number | undefined

  constructor(ttl?: TTL) {
    super()
    super.subscribe(this.onChange)

    if (ttl) this.time = timeToMs(ttl)
  }

  set(key: string, value: V, ttl?: Times): this {
    const time = ttl ? timeToMs(ttl) : this.time
    super.set(key, value)
    this.expirationTimeoutMap.set(key, setTimeout(() => super.delete(key), time) as any)

    return this
  }

  private onChange = (event: ObservableMapEvent) => {
    switch (event.type) {
      case 'set':
      case 'delete': clearTimeout(this.expirationTimeoutMap.get(event.key)); break
      case 'clear': this.expirationTimeoutMap.forEach(clearTimeout); break
    }
  }
}