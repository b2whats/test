
declare  interface AppEvents {
    test: () => void
  }



declare class TypedMap<T = {}> {
  set<K extends PropertyKey, V extends (K extends keyof T ? T[K] : any)>(
      key: K, value: V
    ): asserts this is TypedMap<T & { [k in K]: V }>

  get<K extends keyof T>(key: K): T[K]
}

declare const myMap: TypedMap<{}>


declare namespace myLib {
  export class TypedMap<T = {}> {
    set<K extends PropertyKey, V extends (K extends keyof T ? T[K] : any)>(
        key: K, value: V
      ): asserts this is TypedMap<T & { [k in K]: V }>
  
    get<K extends keyof T>(key: K): T[K]
  }
  
  export const myMap: TypedMap<{}>
}