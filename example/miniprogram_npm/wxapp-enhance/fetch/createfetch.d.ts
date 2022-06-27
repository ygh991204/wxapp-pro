/// <reference types="miniprogram-api-typings" />
import type { FetchConfig, RequestOption, ResponseFulfilled, RequestFulfilled, Rejected, ResponseResult } from './type';
export declare function createFetch(_config?: FetchConfig): {
    <T = any, R = ResponseResult<T>>(url: string, option?: Omit<RequestOption, 'url'>): Promise<R>;
    onRequest(onFulfilled: RequestFulfilled): void;
    onResponse(onFulfilled: ResponseFulfilled): void;
    onError(onRejected: Rejected): void;
    task: {
        clear: () => void;
        abort: (id: string) => void;
        onChunkReceived: (id: string, callback: WechatMiniprogram.OnChunkReceivedCallback) => void;
        offChunkReceived: (id: string, callback: WechatMiniprogram.OffChunkReceivedCallback) => void;
        offHeadersReceived: (id: string, callback: WechatMiniprogram.OffHeadersReceivedCallback) => void;
        onHeadersReceived: (id: string, callback: WechatMiniprogram.OffHeadersReceivedCallback) => void;
        remove: (id: string) => void;
        generateTaskId: ({ taskId, url }: RequestOption) => string;
        add: (task: WechatMiniprogram.RequestTask, id: string, option: RequestOption) => void;
        getList: () => import("./createTask").TaskItem[];
    };
};
