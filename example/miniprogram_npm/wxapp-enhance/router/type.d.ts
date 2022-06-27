/// <reference types="miniprogram-api-typings" />
import type { IAnyObject, IFuncObject } from '../type';
export declare enum NavigateType {
    NavigateTo = "navigateTo",
    RedirectTo = "redirectTo",
    ReLaunch = "reLaunch",
    SwitchTab = "switchTab"
}
export declare enum RouterType {
    Push = "push",
    ReLaunch = "reLaunch",
    Redirect = "redirect",
    Switch = "switch"
}
export declare type NavigateOption = {
    path: string;
    query?: IAnyObject;
    emit?: IAnyObject;
    on?: IFuncObject;
    navigateType: NavigateType;
    routerType: RouterType;
};
export declare type NavigateToSuccessResult = {
    eventChannel?: WechatMiniprogram.EventChannel;
    errMsg: string;
};
export declare type PushOption = Omit<NavigateOption, 'navigateType' | 'routerType'>;
export declare type ReLaunchOption = Omit<PushOption, 'emit' | 'on'>;
export declare type RedirectOption = Omit<PushOption, 'emit' | 'on'>;
export declare type SwitchTabOption = Omit<PushOption, 'emit' | 'on' | 'query'>;
export declare type BeforeEachFulfilled = (to: NavigateOption) => NavigateOption | Promise<NavigateOption>;
export declare type AfterEachFulfilled = (reslut: NavigateToSuccessResult, to: NavigateOption) => NavigateToSuccessResult | Promise<NavigateToSuccessResult>;
export declare type Rejected = (err: any, to: NavigateOption | 'back') => any;
