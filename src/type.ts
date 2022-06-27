export type ITypeIObject<T> = Record<any, T>
export type IAnyObject = ITypeIObject<any>
export type IFuncObject = ITypeIObject<(val: any) => void>
