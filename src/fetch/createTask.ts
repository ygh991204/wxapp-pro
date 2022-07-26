import type { RequestOption } from './type'
import { uuid } from '../utils'

/** 最大并发限制 */
const TASK_MAX = 10

/** 请求任务 */
export type TaskItem = {
  id: string /** 任务ID */
  task: WechatMiniprogram.RequestTask /** 任务对象 */
  option: RequestOption /** 请求option */
}

export function createTask() {
  /** 请求任务列表 */
  let list: TaskItem[] = []

  /** 根据任务ID获取请求任务 */
  function getTaskById(id: string) {
    const task = list.filter((v) => v.id === id)
    return task.length ? task[0] : undefined
  }

  /** 根据任务ID获取请求任务 */
  function getTaskByIdError(id: string) {
    const task = getTaskById(id)
    if (task) {
      return task
    } else {
      /** 如果没有找到任务ID */
      throw new Error('请求 ' + id + ' 不在任务列表中')
    }
  }

  /** 生成请求任务ID - 根据请求option */
  function generateTaskId({ taskId, url }: RequestOption) {
    const _id = taskId || uuid() //
    const hasTask = getTaskById(_id)
    if (hasTask) {
      /** 如果 ID 存在 */
      throw new Error('请求 ' + url + '___' + _id + ' 在任务列表中已存在')
    }
    if (list.length === TASK_MAX) {
      /** 超出最大请求限制 */
      throw new Error('请求 ' + url + '___' + _id + ' 失败，已超出最大并发限制' + TASK_MAX)
    }
    return _id
  }

  /** 新增任务 */
  function add(task: WechatMiniprogram.RequestTask, id: string, option: RequestOption) {
    list.push({
      id,
      task,
      option
    })
  }

  /** 删除任务 */
  function remove(id: string) {
    list = list.filter((v) => v.id !== id)
  }

  /** 清空任务 */
  function clear() {
    list = []
  }

  function abort(id: string) {
    getTaskByIdError(id).task.abort()
  }

  function onHeadersReceived(id: string, callback: WechatMiniprogram.OffHeadersReceivedCallback) {
    getTaskByIdError(id).task.onHeadersReceived(callback)
  }

  function onChunkReceived(id: string, callback: WechatMiniprogram.OnChunkReceivedCallback) {
    getTaskByIdError(id).task.onChunkReceived(callback)
  }

  function offChunkReceived(id: string, callback: WechatMiniprogram.OffChunkReceivedCallback) {
    getTaskByIdError(id).task.offChunkReceived(callback)
  }

  function offHeadersReceived(id: string, callback: WechatMiniprogram.OffHeadersReceivedCallback) {
    getTaskByIdError(id).task.offHeadersReceived(callback)
  }

  function getList() {
    return list
  }

  return {
    clear,
    abort,
    onChunkReceived,
    offChunkReceived,
    offHeadersReceived,
    onHeadersReceived,
    remove,
    generateTaskId,
    add,
    getList,
    getTaskById
  }
}
