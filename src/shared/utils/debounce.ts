export function debounce<V extends any[], R>(func: (...args: V) => R, timeout = 300, immediate?: boolean){
  let timer: number | undefined

  return (...args: V) => {
    immediate && !timer && func(...args)
    
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      func(...args)
      timer = undefined
    }, timeout)
  }
}