export class EventEmitter<Events extends Record<string, (...args: any) => any>> {
  private events = {} as Record<keyof Events, Set<(...args: any) => any>>

  on<T extends keyof Events>(name: T, fn: Events[T]) {
    this.events[name] = (this.events[name] || new Set()).add(fn)

    return this
  }

  once<T extends keyof Events>(name: T, fn: Events[T]) {
    const callback: any = (...parms: any) => {
      this.off(name, callback)
      fn(...parms)
    }
    
    return this.on(name, callback)
  }

  off<T extends keyof Events>(name: T, fn: Events[T]) {
    const handlers = this.events[name]
    if (!handlers) return this
    
    handlers.delete(fn)

    if (handlers.size === 0) {
      delete this.events[name]
    }

    return this
  }

  emit<T extends keyof Events>(name: T, ...args: Parameters<Events[T]>) {
    const handlers = this.events[name]

    if (!handlers) return this

    handlers.forEach((fn) => fn(...args))

    return this
  }

  listeners(name?: keyof Events) {
    if (name !== undefined) {
      const handlers = this.events[name]

      return !handlers ? [] : Array.from(handlers)
    }

    let result = {}
    for (const [event, handlers] of Object.entries(this.events)) {
      result[event] = Array.from(handlers || [])
    }

    return result
  }

  clear(name?: keyof Events) {
    if (name !== undefined) {
      this.events[name]?.clear()

      return this
    }

    this.events = {} as any
    
    return this
  }
}
