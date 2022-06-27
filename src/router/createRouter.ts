import type {
  PushOption,
  ReLaunchOption,
  RedirectOption,
  SwitchTabOption,
  NavigateOption,
  AfterEachFulfilled,
  BeforeEachFulfilled,
  Rejected,
  NavigateToSuccessResult,
} from './type'

import cloneDeep from 'lodash-es/cloneDeep'

import { qsStringify } from '../utils'
import { NavigateType, RouterType } from './type'

export function createRouter() {
  let lock = false

  let beforeEachFulfilled: BeforeEachFulfilled = function (to) {
    return to
  }

  let afterEachFulfilled: AfterEachFulfilled = function (reslut, to) {
    return reslut
  }

  let rejected: Rejected = function (err, to) {
    return err
  }

  async function navigate(option: NavigateOption) {
    try {
      let _option = cloneDeep(option)
      if (lock) {
        throw new Error('[Router] navigate 失败，有页面未跳转完成')
      }
      lock = true
      _option = await beforeEachFulfilled(_option)
      let reslut = null as unknown as NavigateToSuccessResult
      const url = _option.query ? _option.path + '?' + qsStringify(_option.query) : _option.path
      switch (_option.navigateType) {
        case NavigateType.NavigateTo:
          reslut = await wx.navigateTo({
            url,
            events: _option.on || {},
          })
          break
        default:
          reslut = await wx[_option.navigateType]({
            url,
          })
          break
      }
      if (reslut.eventChannel && _option.emit) {
        const eventChannel = reslut.eventChannel
        Object.keys(_option.emit)
          .sort()
          .forEach((key) => {
            eventChannel.emit(key, _option.emit)
          })
      }
      const _reslut = await afterEachFulfilled(reslut, _option)
      lock = false
      return _reslut
    } catch (e) {
      lock = false
      throw rejected(e, option) || e
    }
  }

  function onBeforeEach(onFulfilled: BeforeEachFulfilled) {
    beforeEachFulfilled = onFulfilled
  }

  function onAfterEach(onFulfilled: AfterEachFulfilled) {
    afterEachFulfilled = onFulfilled
  }

  function onError(onRejected: Rejected) {
    rejected = onRejected
  }

  /**
   * 
   */
  async function push(option: PushOption) {
    return await navigate({
      ...option,
      navigateType: NavigateType.NavigateTo,
      routerType: RouterType.Push,
    })
  }

  async function reLaunch(option: ReLaunchOption) {
    return await navigate({
      ...option,
      navigateType: NavigateType.ReLaunch,
      routerType: RouterType.ReLaunch,
    })
  }

  /**
   * 重定向
   */
  async function redirect(option: RedirectOption) {
    return await navigate({
      ...option,
      navigateType: NavigateType.RedirectTo,
      routerType: RouterType.Redirect,
    })
  }

  /**
   * 跳转到 tab页
   */
  async function switchTab(option: SwitchTabOption) {
    return await navigate({
      ...option,
      navigateType: NavigateType.SwitchTab,
      routerType: RouterType.Switch,
    })
  }

  /**
   * 返回
   */
  async function back(delta = 1) {
    if (lock) {
      throw new Error('[Router] back 失败，有页面未跳转完成')
    }
    lock = true
    try {
      const reslut = await wx.navigateBack({
        delta,
      })
      lock = false
      return reslut
    } catch (e) {
      lock = false
      throw e
    }
  }

  return {
    onAfterEach,
    onBeforeEach,
    onError,
    back,
    push,
    switchTab,
    reLaunch,
    redirect,
  }
}
