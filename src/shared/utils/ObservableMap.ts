import { Observable } from './Observable'

type SetEvent<K, V> = {
  key: K
  type: 'set'
  oldValue: V | undefined
  value: V
}

type DeleteEvent<K, V> = {
  key: K
  type: 'delete'
  oldValue: V | undefined
}

type ClearEvent<K> = {
  keys: Set<K>
  type: 'clear'
}

type EventFunction<K, V> = {
  (event: ObservableMapEvent<K, V>): void
  comparator?: (event: ObservableMapEvent<K, V>) => boolean
}

export type ObservableMapEvent<K = any, V = any> = SetEvent<K, V> | DeleteEvent<K, V> | ClearEvent<K>

export interface ObservableMap<K, V> {
  get<Value = V>(key: K): Value | undefined
  get(key: K): V | undefined
  set(key: K, value: V): this
  set(key: K, value: V, ...args: any[]): this
}

export class ObservableMap<K = any, V = any> extends Map<K, V> {
  private subject = new Observable<ObservableMapEvent<K, V>>()

  constructor(entries?: [K, V][] | null) {
    super(entries)
  }

  createEvent(type: ObservableMapEvent['type'], key?: K, value?: V): ObservableMapEvent<K, V> {
    switch (type) {
      case 'set': return {
        type: 'set',
        key: key!,
        value: value!,
        oldValue: super.get(key!),
      }
      case 'delete': return {
        type: 'delete',
        key: key!,
        oldValue: super.get(key!),
      }
      case 'clear': return {
        keys: new Set(this.keys()),
        type: 'clear',
      }
    }
  }

  set(key: K, value: V): this {
    if (value === super.get(key)) return this

    const event = this.createEvent('set', key, value)
    super.set(key, value)
    this.subject.emit(event)
    
    return this
  }

  delete(key: K) {
    if (!super.has(key)) return false

    const event = this.createEvent('delete', key)
    const result =  super.delete(key)
    this.subject.emit(event)

    return result
  }

  clear() {
    if (this.size === 0) return

    const event = this.createEvent('clear')
    super.clear()
    this.subject.emit(event)
  }

  toJSON() {
    return Array.from(super.entries())
  }

  toString() {
    return JSON.stringify(this)
  }

  fromString(data: string) {
    if (data.trim() === '') return this.clear()

    const entries: [K, V][] = JSON.parse(data)

    if (!Array.isArray(entries)) return
    
    this.merge(new Map(entries))
  }

  private merge(newMap: Map<K, V>) {
    super.forEach((_, key) => {
      if (newMap.has(key)) {
        this.set(key, newMap.get(key)!)
        newMap.delete(key)
      } else {
        this.delete(key)
      }
    })

    newMap.forEach((value, key) => {
      this.set(key, value)
    })
  }

  subscribe(fn: EventFunction<K, V>, deps?: K[]) {
    if (deps) {
      fn.comparator = (event) => event.type === 'clear'
        ? deps.some(key => event.keys.has(key))
        : deps.includes(event.key)
    }
    return this.subject.subscribe(fn)
  }

  unsubscribe(fn: (event: ObservableMapEvent<K, V>) => void) {
    this.subject.unsubscribe(fn)
  }

  track(fn: EventFunction<K, V>) {
    const deps: K[] = []

    return {
      get: (name: K) => {
        if (!deps.includes(name)) deps.push(name)
        
        return super.get(name)
      },
      unsubscribe: this.subscribe(fn, deps),
      reset: () => {
        deps.length = 0
      }
    }
  }
}

export class Tracker<K, V> {
  private track: Set<K> = new Set()

  constructor(private observable: ObservableMap<K, V>, private observer: EventFunction<K, V>) {}

  get(name: K) {
    if (!this.track.has(name)) {
      this.track.add(name)
      this.observable.unsubscribe(this.observer)
      this.observable.subscribe(this.observer, Array.from(this.track))
    }

    return this.observable.get(name)
  }
}