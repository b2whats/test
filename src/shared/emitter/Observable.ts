export type Observer<T extends [...any]> = (...args: T) => void
interface Observable {
  new<T1>(): ObservableConstructor<[T1]>
  new<T1, T2>(): ObservableConstructor<[T1, T2]>
  new<T1, T2, T3>(): ObservableConstructor<[T1, T2, T3]>
  readonly prototype: ObservableConstructor<any>
}
class ObservableConstructor<T extends [...any]>  {
  private subscribers = new Set<Observer<T>>()

  subscribe(fn: Observer<T>) {
    this.subscribers.add(fn)

    return () => this.unsubscribe(fn)
  }

  unsubscribe(fn: Observer<T>): void {
    this.subscribers.delete(fn)
  }

  unsubscribeAll() {
    this.subscribers.clear()
  }

  emit(...args: T): void {
    this.subscribers.forEach((observable) => observable(...args))
  }
}

export const Observable: Observable = ObservableConstructor