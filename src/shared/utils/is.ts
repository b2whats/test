export const isObject = (value: any): value is Record<PropertyKey, any> => value && value.constructor && value.constructor === Object
export const isString = (value: any): value is string => typeof value === 'string'
export const isNumber = (value: any): value is number => typeof value === 'number'
export const isPropertyKeys = (keys: any[]): keys is PropertyKey[] => keys.every(key => typeof key === 'string' || typeof key === 'number')