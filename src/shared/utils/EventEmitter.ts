export class EventEmitter<E extends Record<string, (...args: any) => void>> {
  private eventsTree = new NodeEvents('')

  on<T extends WithMask<keyof E>>(path: T, fn: EventFn<E, T>) {
    this.eventsTree.add(path.split('.'), fn)

    return this
  }

  once<T extends WithMask<keyof E>>(path: T, fn: EventFn<E, T>) {
    const callback: any = (...args: any) => {
      this.off(path, callback)
      fn(...args)
    }
    
    return this.on(path, callback)
  }

  off<T extends WithMask<keyof E>>(path: T, fn: EventFn<E, T>) {
    this.eventsTree.delete(path.split('.'), fn)
  }

  emit<T extends keyof E, Args extends any[] = Parameters<E[T]>>(path: T & string, ...args: Args) {
    this.eventsTree.emit(path.split('.'), path, ...args)
  }  
}

class NodeEvents {
  private path = ''
  private events = new Set<Function>()
  private children = new Map<string, NodeEvents>()
  private mask: boolean = false

  constructor(private name: string, parent?: NodeEvents) {
    if (!parent) return

    this.mask = name[0] === '*' || parent.mask
    parent.children.set(this.name, this)
    this.path = parent.path ? `${parent.path}.${this.name}` : this.name
  }

  child(name: string) {
    return this.children.get(name)
  }

  add([name, ...paths]: string[], cb: Function) {
    if (name === undefined) {
      this.events.add(cb)
    } else {
      const node = this.child(name) ?? new NodeEvents(name, this)
      node.add(paths, cb)
    }
  }

  delete([name, ...paths]: string[], cb: Function) {
    if (name === undefined) {
      this.events.delete(cb)
    } else {
      this.child(name)?.delete(paths, cb) 
    }
  }

  emit([name, ...paths]: string[], path: string, ...args: any[]) {
    if (name === undefined || this.name === '**') {
      const params = this.mask ? [path, ...args] : args
      this.events.forEach((cb) => cb(...params))
    } else {
      this.child(name)?.emit(paths, path, ...args)
      this.child('*')?.emit(paths, path, ...args)
      this.child('**')?.emit(paths, path, ...args)
    }
  }
}

type WithMask<T> = 
  T extends `${infer A}.${infer B}.${infer C}.${infer D}` ? `${A}.${B | '*'}.${C | '*'}.${D | '*'}` | `${A}.**` | `${A}.${B}.**` | `${A}.${B}.${C}.**`:
  T extends `${infer A}.${infer B}.${infer C}` ? `${A}.${B | '*'}.${C | '*'}` | `${A}.**` | `${A}.${B}.**` :
  T extends `${infer A}.${infer B}` ? `${A}.${B | '*'}` | `${A}.**`:
  (T & string) | '*' | '**'

type IsMultiMask<T> = T extends `${string}**` ? true : false
type IsMask<T> = T extends `${string}*${string}` ? true : false
type SegmentCount<T> = 
  T extends `${string}.${string}.${string}.${string}.${string}` ? 5 :
  T extends `${string}.${string}.${string}.${string}` ? 4 :
  T extends `${string}.${string}.${string}` ? 3 :
  T extends `${string}.${string}` ? 2 :
  1

type Template<T, P extends string = '*'> = 
  T extends `${infer A}${P}${infer B}${P}${infer C}${P}${infer D}` ? `${A}${string}${B}${string}${C}${string}${D}` :
  T extends `${infer A}${P}${infer B}${P}${infer C}` ? `${A}${string}${B}${string}${C}` :
  T extends `${infer A}${P}${infer B}` ? `${A}${string}${B}` :
  T

type MaskMatch<T, M> = IsMultiMask<M> extends true ? true : SegmentCount<T> extends SegmentCount<M> ? true : false

type EventType<E, T, K extends keyof E = keyof E, P = Template<T>> = K extends P ? MaskMatch<K, T> extends true
  ? E[K] extends (...args: infer Args) => void ? [K, ...Args] : never
  : never : never

type Fill<T extends unknown[], N> = 
  N extends 5 ? [T[0], T[1], T[2], T[3], T[4]] :
  N extends 4 ? [T[0], T[1], T[2], T[3]] :
  N extends 3 ? [T[0], T[1], T[2]] :
  N extends 2 ? [T[0], T[1]] :
  T

type MaxNumber<T extends number> =
  5 extends T ? 5 :
  4 extends T ? 4 :
  3 extends T ? 3 :
  2 extends T ? 2 :
  1 extends T ? 1 :
  0

type SameArity<T extends any[], M = MaxNumber<T['length']>> = T extends any[] ? Fill<T, M> : never

type EventFn<E, T> = IsMask<T> extends true
  ? (...args: SameArity<EventType<E, T>>) => void
  : T extends keyof E ? E[T] : never
