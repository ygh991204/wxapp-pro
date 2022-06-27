/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
import type { RequestOption } from './type';
export declare type TaskItem = {
    id: string;
    task: WechatMiniprogram.RequestTask;
    option: RequestOption;
};
export declare function createTask(): {
    clear: () => void;
    abort: (id: string) => void;
    onChunkReceived: (id: string, callback: WechatMiniprogram.OnChunkReceivedCallback) => void;
    offChunkReceived: (id: string, callback: WechatMiniprogram.OffChunkReceivedCallback) => void;
    offHeadersReceived: (id: string, callback: WechatMiniprogram.OffHeadersReceivedCallback) => void;
    onHeadersReceived: (id: string, callback: WechatMiniprogram.OffHeadersReceivedCallback) => void;
    remove: (id: string) => void;
    generateTaskId: ({ taskId, url }: RequestOption) => string;
    add: (task: WechatMiniprogram.RequestTask, id: string, option: RequestOption) => void;
    getList: () => TaskItem[];
};
