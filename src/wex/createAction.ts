
export type Action<D = any> = ReturnType<typeof createAction<D>>

/**
 * 创建 action
 */
export function createAction<T = any>(type: string, payload?: T) {
  return {
    type,
    payload,
  } as {
    type: string,
    payload?: T
  }
}
