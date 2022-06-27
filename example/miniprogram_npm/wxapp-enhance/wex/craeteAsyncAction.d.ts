import type { AsyncThunkApi } from './creatStore';
export declare type AsyncAction = (thunkApi: AsyncThunkApi) => Promise<any>;
/**
 * 创建异步 action
 */
export declare function craeteAsyncAction<D = any, T = any>(typePrefix: string, thunk: (data: D, thunkApi: AsyncThunkApi) => Promise<T>): {
    (payload?: any): (thunkApi: AsyncThunkApi) => Promise<T>;
    pending: string;
    fulfilled: string;
    rejected: string;
};
