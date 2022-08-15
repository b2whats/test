export function debounce<V extends any[], R>(func: (...args: V) => R, timeout = 300, immediate?: boolean){
  let timer: NodeJS.Timeout | undefined

  return (...args: V) => {
    immediate && !timer && func(...args)
    
    clearTimeout(timer!)
    timer = setTimeout(() => {
      func(...args)
      timer = undefined
    }, timeout)
  }
}