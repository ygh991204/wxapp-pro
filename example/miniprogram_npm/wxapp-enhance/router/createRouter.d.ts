/// <reference types="miniprogram-api-typings" />
import type { PushOption, ReLaunchOption, RedirectOption, SwitchTabOption, AfterEachFulfilled, BeforeEachFulfilled, Rejected, NavigateToSuccessResult } from './type';
export declare function createRouter(): {
    onAfterEach: (onFulfilled: AfterEachFulfilled) => void;
    onBeforeEach: (onFulfilled: BeforeEachFulfilled) => void;
    onError: (onRejected: Rejected) => void;
    back: (delta?: number) => Promise<WechatMiniprogram.GeneralCallbackResult>;
    push: (option: PushOption) => Promise<NavigateToSuccessResult>;
    switchTab: (option: SwitchTabOption) => Promise<NavigateToSuccessResult>;
    reLaunch: (option: ReLaunchOption) => Promise<NavigateToSuccessResult>;
    redirect: (option: RedirectOption) => Promise<NavigateToSuccessResult>;
};
