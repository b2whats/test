export type ObservableCallback<T extends [...any]> = (...args: T) => void

class ObservableFactory<T extends [...any]>  {
  private observables = new Set<ObservableCallback<T>>()

  subscribe(fn: ObservableCallback<T>) {
    this.observables.add(fn)

    return () => this.unsubscribe(fn)
  }

  unsubscribe(fn: ObservableCallback<T>): void {
    this.observables.delete(fn)
  }

  unsubscribeAll() {
    this.observables.clear()
  }

  emit(...args: T): void {
    this.observables.forEach((observable) => observable(...args))
  }
}

export const Observable: {
  new<T1>(): ObservableFactory<[T1]>
  new<T1, T2>(): ObservableFactory<[T1, T2]>
  new<T1, T2, T3>(): ObservableFactory<[T1, T2, T3]>
  readonly prototype: ObservableFactory<any>
} = ObservableFactory