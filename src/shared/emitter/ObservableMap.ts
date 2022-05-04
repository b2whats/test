import { Observable, ObservableCallback } from './Observable'
import { isPropertyKeys } from '../utils/is'

type SetEvent<K, V> = {
  object: ObservableMap<K, V>
  key: K
  type: 'set'
  oldValue: V | undefined
  value: V
}

type DeleteEvent<K, V> = {
  object: ObservableMap<K, V>
  key: K
  type: 'delete'
  oldValue: V | undefined
}

type ClearEvent<K, V> = {
  object: ObservableMap<K, V>
  type: 'clear'
}

export type MapEvent<K = any, V = any> = SetEvent<K, V> | DeleteEvent<K, V> | ClearEvent<K, V>

export interface ObservableMap<K, V> {
  get<Value = V>(key: K): Value | undefined
  toJSON(): K extends string ? Record<string, V>  : never
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
        object: this,
        key: key!,
        value: value!,
        oldValue: super.get(key!),
      }
      case 'delete': return {
        type: 'delete',
        object: this,
        key: key!,
        oldValue: super.get(key!),
      }
      case 'clear': return {
        type: 'clear',
        object: this,
      }
    }
  }

  set(key: K, value: V) {
    this.subject.emit(this.createEvent('set', key, value))
    
    super.set(key, value)
    
    return this
  }

  delete(key: K) {
    this.subject.emit(this.createEvent('delete', key))

    return super.delete(key)
  }

  clear() {
    this.subject.emit(this.createEvent('clear'))

    super.clear()
  }

  toJSON(): K extends string ? Record<string, V>  : never {
    const keys = Array.from(super.keys())

    if (isPropertyKeys(keys)) {
      console.error('Keys must be string or number')
      return {}
    }

    const result = {} as Record<string, V>
    super.forEach((value, key) => result[key as any] = value)

    return result
  }

  toString() {
    return JSON.stringify(this.toJSON())
  }

  subscribe(fn: ObservableCallback<[MapEvent<K, V>]>) {
    return this.subject.subscribe(fn)
  }

  unsubscribe(fn: ObservableCallback<[MapEvent<K, V>]>) {
    this.subject.unsubscribe(fn)
  }
}


export const ObservableMap_: {
  new<K extends string, V>(): ObservableMap<K, V>
  new<K, V>(): Omit<ObservableMap<K, V>, 'toJSON'>
  readonly prototype: Omit<ObservableMap, never>
} = ObservableMap as any

const aa = new ObservableMap_<string, any>()
aa.toJSON()
const bb = new ObservableMap_<Function, any>()
JSON.stringify(bb.toJSON())

class ON<K extends string> extends ObservableMap_<number, any> {
  constructor() {
    super()
  }
}

const a = new ObservableMap<string, string>()
a.subscribe((event) => {
  if (event.type === 'set') event
  if (event.type === 'delete') event
  if (event.type === 'clear') event
})
a.toJSON()