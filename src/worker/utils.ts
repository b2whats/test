export const isHTMLfile = (request: Request): boolean => request.headers.get('Accept')?.includes('text/html') === true
export const isJSfile = (request: Request): boolean => request.headers.get('Accept')?.includes('text/javascript') === true
export const isCSSfile = (request: Request): boolean => request.headers.get('Accept')?.includes('text/css') === true
export const isIMGfile = (request: Request): boolean => request.headers.get('Accept')?.includes('image') === true

export const isEmptyObject = (obj: object) => {
  for (let _ in obj) {
    return false
  }
  return true
}