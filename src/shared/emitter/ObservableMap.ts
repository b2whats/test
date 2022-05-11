import { Observable, Observer } from './Observable'

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
  keys: K[]
  type: 'clear'
}

export type MapEvent<K = any, V = any> = SetEvent<K, V> | DeleteEvent<K, V> | ClearEvent<K>

export interface ObservableMap<K, V> {
  get<Value = V>(key: K): Value | undefined
  get(key: K): V | undefined
}

export class ObservableMap<K = any, V = any> extends Map<K, V> {
  private subject = new Observable<MapEvent<K, V>>()

  constructor(entries?: [K, V][] | null) {
    super(entries)
  }

  createEvent(type: MapEvent['type'], key?: K, value?: V): MapEvent<K, V> {
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
        keys: Array.from(this.keys()),
        type: 'clear',
      }
    }
  }

  set(key: K, value: V) {
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

  merge(newMap: Map<K, V>) {
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

  subscribe(fn: Observer<[MapEvent<K, V>]>) {
    return this.subject.subscribe(fn)
  }

  unsubscribe(fn: Observer<[MapEvent<K, V>]>) {
    this.subject.unsubscribe(fn)
  }
}