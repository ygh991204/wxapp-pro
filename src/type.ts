export type ITypeObject<T> = Record<any, T>
export type IAnyObject = ITypeObject<any>
export type IFuncObject = ITypeObject<(val: any) => void>
