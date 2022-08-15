type Observer<T extends [...any]> = {
  (...args: T): void
  comparator?: (...args: T) => boolean
}

type ObservableConstructor = {
  new<T1>(): Observable<[T1]>
  new<T1, T2>(): Observable<[T1, T2]>
  new<T1, T2, T3>(): Observable<[T1, T2, T3]>
  readonly prototype: Observable<any>
}

interface Observable<T extends [...any]> {
  subscribe(fn: Observer<T>): () => void
  unsubscribe(fn: Observer<T>): void
  unsubscribeAll(): void
  emit(...args: T): void
}

class _Observable<T extends [...any]> implements Observable<T> {
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
    this.subscribers.forEach((observable) => {
      observable.comparator
        ? observable.comparator(...args) && observable(...args)
        : observable(...args)
    })
  }
}

export const Observable: ObservableConstructor = _Observable