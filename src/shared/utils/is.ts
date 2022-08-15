export const isObject = (value: any): value is Record<PropertyKey, any> => value && value.constructor && value.constructor === Object
export const isString = (value: any): value is string => typeof value === 'string'
export const isNumber = (value: any): value is number => typeof value === 'number'

export const isEmptyObject = (obj: object): obj is { [key: string]: never} => {
  for (let _ in obj) return false
  return true
}