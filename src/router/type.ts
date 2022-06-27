
import type { IAnyObject, IFuncObject } from '../type'

/** 微信 Navigate 类型 */
export enum NavigateType {
  NavigateTo = 'navigateTo',
  RedirectTo = 'redirectTo',
  ReLaunch = 'reLaunch',
  SwitchTab = 'switchTab',
}

/** Router 类型 */
export enum RouterType {
  Push = 'push',
  ReLaunch = 'reLaunch',
  Redirect = 'redirect',
  Switch = 'switch',
}

export type NavigateOption = {
  /** 页面路径 */  
  path: string
  /** 页面参数 */
  query?: IAnyObject
  /** 向被打开页面  */
  emit?: IAnyObject
  on?: IFuncObject
  navigateType: NavigateType
  routerType: RouterType
}

export type NavigateToSuccessResult = {
  eventChannel?: WechatMiniprogram.EventChannel
  errMsg: string
}

export type PushOption = Omit<NavigateOption, 'navigateType' | 'routerType'>

export type ReLaunchOption = Omit<PushOption, 'emit' | 'on'>

export type RedirectOption = Omit<PushOption, 'emit' | 'on'>

export type SwitchTabOption = Omit<PushOption, 'emit' | 'on' | 'query'>

export type BeforeEachFulfilled = (to: NavigateOption) => NavigateOption | Promise<NavigateOption>

export type AfterEachFulfilled = (
  reslut: NavigateToSuccessResult,
  to: NavigateOption
) => NavigateToSuccessResult | Promise<NavigateToSuccessResult>

export type Rejected = (err: any, to: NavigateOption) => any