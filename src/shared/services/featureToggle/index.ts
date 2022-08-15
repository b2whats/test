import { FeatureToggleService } from './FeatureToggleService'
import { createHook } from './hook'

export const featureToggle = new FeatureToggleService([
  {
    name: 'test-on',
    active: true,
    description: 'Тестовый фича тогл, по умолчанию включен'
  },
  {
    name: 'MESSENGER_SIGNUP',
    active: false,
    description: 'Тестовый фича тогл, по умолчанию выключен'
  },
  {
    name: 'MESSENGER_PAYMENTS',
    active: false,
    description: 'Тестовый фича тогл, по умолчанию выключен'
  },
], window.localStorage)

export const useFeatureToggle = createHook(featureToggle)

const a = useFeatureToggle('test-on') 