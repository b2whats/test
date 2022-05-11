export class EventEmitter<Events extends Record<string, (...args: any) => void>> {
  private events = new Map<keyof Events, Set<Function>>()

  on<T extends keyof Events>(name: T, fn: Events[T]) {
    this.events.get(name)?.add(fn) ?? this.events.set(name, new Set([fn]))

    return this
  }

  once<T extends keyof Events>(name: T, fn: Events[T]) {
    const callback: any = (...args: any) => {
      this.off(name, callback)
      fn(...args)
    }
    
    return this.on(name, callback)
  }

  off<T extends keyof Events>(name: T, fn: Events[T]) {
    this.events.get(name)?.delete(fn)
  }

  emit<T extends keyof Events>(name: T, ...args: Parameters<Events[T]>) {
    this.events.get(name)?.forEach((fn) => fn(...args))
  }

  listeners(name?: keyof Events) {
    if (name !== undefined) return Array.from(this.events.get(name) || [])

    let result = {} as Record<keyof Events, Function[]>
    this.events.forEach((value, key) => (result[key] = Array.from(value)))

    return result
  }

  clear(name?: keyof Events) {
    if (name !== undefined) this.events.get(name)?.clear()
    else this.events.clear()
  }
}

const test = new EventEmitter()
test.emit('', 1)