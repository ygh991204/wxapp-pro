/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
declare type WxSelf = WechatMiniprogram.Page.Constructor | WechatMiniprogram.Component.Constructor;
declare type EventListenHandler<T = any> = (val: T) => void;
export interface Listen {
    event: string;
    handler: EventListenHandler;
    triggerCount: number;
    limitCount: number;
    self?: WxSelf;
}
export declare function createEvent(events: string[]): {
    $on: <T = any>(event: string, handler: EventListenHandler<T>, self?: WxSelf) => void;
    $emit: <T_1 = any>(event: string, data?: T_1) => void;
    $off: (event: string, handler: EventListenHandler) => void;
    $once: <T_2 = any>(event: string, handler: EventListenHandler<T_2>, self?: WxSelf) => void;
    getListens: () => Listen[];
};
export {};
