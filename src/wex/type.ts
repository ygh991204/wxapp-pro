import type { ITypeObject, IAnyObject } from '../type'

export type RootState = IAnyObject

export type StoreOption = {
  debug?: boolean
}

export type ComponentSelectors<State extends RootState = RootState, Name extends keyof State = keyof State> = Array<
[Name, Array<keyof State[Name]> | ITypeObject<keyof State[Name] | ((state: State[Name]) => any)>]
>

/** 组件实例 */
export type ComponentSelf = WechatMiniprogram.Behavior.Instance<
WechatMiniprogram.Behavior.DataOption,
WechatMiniprogram.Behavior.PropertyOption,
WechatMiniprogram.Behavior.MethodOption
>

export type Component = {
  /** 组件 是否在页面中显示 */
  show: Boolean
  /** 组件实例 this */
  self: ComponentSelf
  /**  */
  selectors: ComponentSelectors
}
