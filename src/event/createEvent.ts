type WxSelf = WechatMiniprogram.Page.Constructor | WechatMiniprogram.Component.Constructor

type EventListenHandler<T = any> = (val: T) => void

export interface Listen {
  /** 事件名称 */
  event: string
  /** 处理函数 */
  handler: EventListenHandler
  /** 已触发次数 */
  triggerCount: number
  /** 最大触发次数 */
  limitCount: number
  /** 页面 / 组件 实例 */
  self?: WxSelf
}

export function createEvent(events: string[]) {
  let listens: Listen[] = []

  function getListens() {
    return listens
  }

  function addListen(event: string, handler: EventListenHandler, self?: WxSelf, limitCount = 0) {
    if (!events.includes(event)) {
      throw new Error('[Event] $on | $once，试图监听无效事件：' + event + '有效事件列表：' + events)
    }
    listens.push({
      event,
      handler,
      triggerCount: 0,
      self,
      limitCount,
    })
  }

  /**
   * 监听指定事件
   */
  function $on<T = any>(event: string, handler: EventListenHandler<T>, self?: WxSelf) {
    addListen(event, handler, self)
  }

  /**
   * 监听指定事件 只触发一次
   */
  function $once<T = any>(event: string, handler: EventListenHandler<T>, self?: WxSelf) {
    addListen(event, handler, self, 1)
  }

  /**
   * 触发指定事件
   */
  function $emit<T = any>(event: string, data?: T) {
    if (!events.includes(event)) {
      throw new Error('[Event] $emit，试图触发无效事件：' + event + '有效事件列表：' + events)
    }
    const _listens = listens.filter((listen) => listen.event === event)
    _listens.forEach((listen) => {
      listen.triggerCount++
      if (listen.self) {
        listen.handler.call(listen.self, data)
      } else {
        listen.handler(data)
      }
    })
    listens = listens.filter((listen) => !(listen.limitCount > 0 && listen.limitCount <= listen.triggerCount))
  }

  /**
   * 移除事件
   */
  function $off(event: string, handler: EventListenHandler) {
    listens = listens.filter((listen) => !(listen.event === event && listen.handler === handler))
  }

  return {
    $on,
    $emit,
    $off,
    $once,
    getListens,
  }
}
