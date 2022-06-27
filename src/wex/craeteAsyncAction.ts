import type { AsyncThunkApi } from './creatStore'
import type { DispatchOption } from './type'

import { createAction } from './createAction'

export type AsyncAction = (thunkApi: AsyncThunkApi, option: DispatchOption) => Promise<any>

/**
 * 创建异步 action
 */
export function craeteAsyncAction<D = any, T = any>(
  typePrefix: string,
  thunk: (data: D, thunkApi: AsyncThunkApi) => Promise<T>
) {
  /** 成功 */
  const fulfilledType = typePrefix + '/fulfilled'
  /** 失败 */
  const rejectedType = typePrefix + '/rejected'
  /** 等待 */
  const pendingType = typePrefix + '/pending'
  function asyncAction(payload?: any) {
    return async function (thunkApi: AsyncThunkApi, option: DispatchOption) {
      thunkApi.dispatch(createAction(pendingType), option)
      try {
        const res = await thunk(payload, thunkApi)
        thunkApi.dispatch(createAction(fulfilledType, res), option)
        return res
      } catch (err) {
        thunkApi.dispatch(createAction(rejectedType, err), option)
        throw err
      }
    }
  }
  asyncAction.pending = pendingType
  asyncAction.fulfilled = fulfilledType
  asyncAction.rejected = rejectedType
  return asyncAction
}
