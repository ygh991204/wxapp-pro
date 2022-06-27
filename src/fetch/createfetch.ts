import type { FetchConfig, RequestOption, ResponseFulfilled, RequestFulfilled, Rejected } from './type'

import cloneDeep from 'lodash-es/cloneDeep'
import merge from 'lodash-es/merge'
import omit from 'lodash-es/omit'

import { validateURL } from '../utils/validate'
import { createTask } from './createTask'

/**
 *  默认
 */
const defaultConfig: FetchConfig = {
  baseUrl: '',
  method: 'get',
  timeout: 6000,
  header: {
    'content-type': 'application/json',
  },
}

export function createFetch(_config?: FetchConfig) {
    
  /** 默认 */
  const config = merge(cloneDeep(defaultConfig), _config || {})

  /** 创建任务列表 */
  const task = createTask()

  /** 请求 监听 */
  let requestFulfilled: RequestFulfilled = function (config) {
    return config
  }
  /** 响应 监听 */
  let responseFulfilled: ResponseFulfilled = function (respone) {
    return respone
  }
  /** 错误 监听 */
  let rejected: Rejected = function (err) {
    return err
  }

  /** 发起请求 */
  async function fetch<T = any, R = WechatMiniprogram.RequestSuccessCallbackResult<T>>(
    url: string,
    option?: Omit<RequestOption, 'url'>
  ) {
    try {
      let _option = merge(cloneDeep(config), { url, ...(option || {}) })
      _option = await requestFulfilled(omit(_option, ['baseUrl']))
      const response = await wxRequest(_option)
      const reslut = await responseFulfilled(response as any)
      return reslut as unknown as R
    } catch (err) {
      throw rejected(err) || err
    }
  }

  /**
   * 请求 拦截
   */
  fetch.onRequest = function (onFulfilled: RequestFulfilled) {
    requestFulfilled = onFulfilled
  }

  /**
   * 响应拦截
   */
  fetch.onResponse = function (onFulfilled: ResponseFulfilled) {
    responseFulfilled = onFulfilled
  }

  /**
   * 错误处理
   */
  fetch.onError = function (onRejected: Rejected) {
    rejected = onRejected
  }

  /** */
  fetch.task = task

  /** 微信请求 */
  function wxRequest(option: RequestOption) {
    const taskOption = cloneDeep(option)
    /** 创建请求 任务ID */
    const taskid = task.generateTaskId(taskOption)
    /** 处理 url */
    option.url = validateURL(option.url) ? option.url : config.baseUrl + option.url
    /** method 大写 */
    if (option.method) option.method = option.method.toUpperCase() as any

    return new Promise((resolve, reject) => {
      task.add(
        wx.request({
          ...(omit(option, ['taskId']) as any),
          fail(err) {
            reject(err)
          },
          success: (res) => {
            resolve(res)
          },
          complete: () => {
            /** 删除任务 */
            task.remove(taskid)
          },
        }),
        taskid,
        taskOption
      )
    })
  }

  return fetch

}
