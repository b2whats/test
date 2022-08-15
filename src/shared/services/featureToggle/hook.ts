import { useReducer, useEffect } from 'react'
import type { FeatureToggleService } from './FeatureToggleService'

type Tuple<T, L extends number> = 
  L extends 6 ? [T, T, T, T, T, T] :
  L extends 5 ? [T, T, T, T, T] :
  L extends 4 ? [T, T, T, T] :
  L extends 3 ? [T, T, T] :
  L extends 2 ? [T, T] :
  L extends 1 ? [T] :
  L extends 0 ? [] :
  never

export const createHook = <T extends string>(service: FeatureToggleService<T>) => <K extends T[]>(...keys: K): K['length'] extends 1 ? boolean : Tuple<boolean, K['length']> => {
  const forceUpdate = useReducer(() => ({}), {})[1]

  useEffect(() => service.subscribe(forceUpdate, keys), [])

  return keys.length === 1
    ? service.get(keys[0])
    : keys.map(key => service.get(key)) as any
}