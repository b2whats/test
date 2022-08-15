import { useReducer, useEffect, useState } from 'react'
import type { FeatureToggleService } from './FeatureToggleService'

export const createHook = <T extends string>(service: FeatureToggleService<T>) => () => {
  const forceUpdate = useReducer(() => ({}), {})[1]
  const tracker = useState(() => service.track(forceUpdate))[0]
  tracker.reset()

  useEffect(() => () => tracker.unsubscribe(), [])

  return tracker.get
}