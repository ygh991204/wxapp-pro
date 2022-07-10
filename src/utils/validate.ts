
export const URLReg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/

export function validateURL(val: string){
  return URLReg.test(val)
}

export const isArray = Array.isArray

export function isFunc(val: any): val is Function {
  return typeof val === 'function'
}
