/// <reference types="miniprogram-api-typings" />
export declare type WxRequestMethod = WechatMiniprogram.RequestOption['method'] | 'options' | 'get' | 'head' | 'post' | 'put' | 'delete' | 'trace' | 'connect';
export declare type WxRequestOption = Omit<WechatMiniprogram.RequestOption, 'complete' | 'fail' | 'success' | 'method'> & {
    method?: WxRequestMethod;
};
/** 响应结果 */
export declare type ResponseResult<T = any> = WechatMiniprogram.RequestSuccessCallbackResult<T>;
export declare type Fulfilled<T> = (value: T) => T | Promise<T>;
export declare type Rejected = (err: any) => any;
export declare type RequestFulfilled = (value: RequestOption) => RequestOption | Promise<RequestOption>;
export declare type ResponseFulfilled = (value: ResponseResult) => ResponseResult | Promise<ResponseResult>;
export declare type FetchConfig = Partial<Omit<WxRequestOption, 'url'> & {
    baseUrl: string;
}>;
/** 请求参数 */
export declare type RequestOption = WxRequestOption & {
    taskId?: string;
};
