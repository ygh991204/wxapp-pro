/// <reference types="miniprogram-api-typings" />
import type { ITypeObject, IAnyObject } from '../type';
import type { ModuleReducer } from './createModule';
import type { Action } from './createAction';
import type { AsyncAction } from './craeteAsyncAction';
import type { StoreOption } from './constant';
export declare type RootState = IAnyObject;
export declare type ComponentSelectors<State extends RootState = RootState, Name extends keyof State = keyof State> = Array<[
    Name,
    Array<keyof State[Name]> | ITypeObject<keyof State[Name] | ((rootState: State[Name]) => any)>
]>;
export declare type ComponentSelf = WechatMiniprogram.Behavior.Instance<WechatMiniprogram.Behavior.DataOption, WechatMiniprogram.Behavior.PropertyOption, WechatMiniprogram.Behavior.MethodOption>;
export declare type Component = {
    /** 组件 是否在页面中显示 */
    show: Boolean;
    /** 组件 数据显示 */
    modules: string[];
    /** 组件实例 this */
    self: ComponentSelf;
    /**  */
    selectors: ComponentSelectors;
};
export declare type AsyncThunkApi = Omit<ReturnType<typeof creatStore>, 'selector'>;
export declare function creatStore<State extends RootState = RootState>(moduleReducers?: ModuleReducer[], _option?: StoreOption): {
    dispatch: (action: Action | AsyncAction) => {
        unwrap: <T = any>() => T | Promise<T>;
    };
    selector: (...options: ComponentSelectors<State>) => string;
    getState: () => State;
};
