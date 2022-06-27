import type { Action } from './createAction'
import type { ITypeIObject, IAnyObject } from '../type'


import { createAction } from './createAction'
import cloneDeep from 'lodash-es/cloneDeep'

export type ModuleCaseReducers<State extends IAnyObject = IAnyObject> = ITypeIObject<
  (state: State, action: Action) => State
>

export type ModuleReducer = ReturnType<typeof createModule>['reducer']

/**
 *  创建 module
 */
export function createModule<
  State extends IAnyObject = IAnyObject,
  CR extends ModuleCaseReducers<State> = ModuleCaseReducers<State>,
  Name extends String = string
>(option: {
  /** 模块名称 */  
  name: Name
  /** 初始值 */
  initialState: State | (() => State)
  /** reducer, 同步 */
  reducers?: CR
  /** reducer，异步 */
  extraReducers?: ModuleCaseReducers<State>
}) {

  let initialState = option.initialState as State

  if (typeof initialState === 'function') {
    initialState = initialState()
  }

  const name = option.name
  const reducers = option.reducers || ({} as CR)
  const reslut = Object.keys(reducers)
    .sort()
    .reduce(
      (_, key) => {
        const type = name + '/' + key
        _.caseReducers[type] = reducers[key]
        _.actions[key] = (paylod: any) => createAction(type, paylod)
        return _
      },
      {
        actions: {},
        caseReducers: {},
      }
    )
  const actions = reslut.actions as {
    [K in keyof CR]: (payload?: any) => Action
  }
  const caseReducers = reslut.caseReducers as CR

  const extraReducers = option.extraReducers || ({} as ModuleCaseReducers<State>)

  return {
    actions,
    name,
    reducer: {
      caseReducers,
      name,
      getInitialState() {
        return cloneDeep(initialState)
      },
      extraReducers
    }
  }
}
