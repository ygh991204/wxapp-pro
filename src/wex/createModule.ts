import type { ITypeObject, IAnyObject } from '../type'
import type { RootState } from './type'
import { isFunc } from '../utils/validate'

export type Module = ReturnType<typeof createModule>

export type ModuleMutations<State extends IAnyObject = IAnyObject> = ITypeObject<(state: State, payload: any) => State>
export type ModuleActions<State extends IAnyObject = IAnyObject> = ITypeObject<
(
  context: {
    state: State
    rootState: RootState
    commit: (type: string, payload: any) => void
    dispatch: (type: string, payload: any) => void | Promise<any>
  },
  payload: any
) => void | Promise<any>
>

/**
 * 创建模块
 */
export function createModule<
  State extends IAnyObject = IAnyObject,
  Mutations extends ModuleMutations<State> = ModuleMutations<State>,
  Actions extends ModuleActions<State> = ModuleActions<State>,
  Name extends string = string
>(options: { state: State | (() => State); mutations?: Mutations; actions?: Actions; name: Name }) {
  const name = options.name

  /** 初始状态 */
  const state = isFunc(options.state) ? options.state() : options.state

  const { mutations, mutationsType } = Object.keys(options.mutations || {}).reduce(
    (prev, key) => {
      prev.mutations[name + '/' + key] = options.mutations[key]
      prev.mutationsType[key] = name + '/' + key
      return prev
    },
    {
      mutations: {},
      mutationsType: {}
    }
  ) as {
    mutations: Mutations
    mutationsType: Record<keyof Mutations, string>
  }

  const { actions, actionsType } = Object.keys(options.actions || {}).reduce(
    (prev, key) => {
      prev.actions[name + '/' + key] = options.actions[key]
      prev.actionsType[key] = name + '/' + key
      return prev
    },
    {
      actions: {},
      actionsType: {}
    }
  ) as {
    actions: Actions
    actionsType: Record<keyof Actions, string>
  }

  return {
    name,
    state,
    actions,
    actionsType,
    mutations,
    mutationsType
  }
}
