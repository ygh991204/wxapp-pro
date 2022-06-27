import type { IAnyObject } from '../type'
import type { ModuleReducer } from './createModule'
import type { Action } from './createAction'
import type { AsyncAction } from './craeteAsyncAction'
import type { StoreOption, DispatchOption, RootState, ComponentSelectors, ComponentSelf, Component } from './type'

import { isArray, isFunc } from '../utils/validate'
import cloneDeep from 'lodash-es/cloneDeep'
import merge from 'lodash-es/merge'

const defaultOption: StoreOption = {
  debug: false,
}

export type AsyncThunkApi = Omit<ReturnType<typeof creatStore>, 'selector'>

export function creatStore<State extends RootState = RootState>(
  moduleReducers?: ModuleReducer[],
  _option?: StoreOption
) {
  const option = merge(cloneDeep(defaultOption), _option || {})

  const { rootState, reducers } = moduleReducers.reduce(
    (prev, reducer) => {
      prev.rootState[reducer.name as string] = reducer.getInitialState()
      prev.reducers = {
        ...prev.reducers,
        ...reducer.caseReducers,
        ...reducer.extraReducers,
      }
      return prev
    },
    {
      rootState: {},
      reducers: {},
    }
  )

  /**
   * 绑定了 store 的组件
   */
  let components: Component[] = []

  function selector(...options: ComponentSelectors<State>) {
    /** 组件 modules */
    const modules = options.map((v) => v[0]) as string[]
    /** 同步状态 */
    const setInitialData = (self: ComponentSelf) => {
      const _data = getSelectorState(options)
      self.setData(_data)
    }
    return Behavior({
      data: getSelectorState(options),
      pageLifetimes: {
        show() {
          /**
           * 组件显示时，如果之前组件 show 为 false，则同步状态
           */
          const _self = getCompoent(this)
          if (!_self.show) {
            componentToggleShow(this, true)
            setInitialData(this)
          }
        },
        hide() {
          componentToggleShow(this, false)
        },
      },
      lifetimes: {
        created() {
          bindComponent(modules, this, options, true)
        },
        detached() {
          unBindComponent(this)
        },
        attached() {
          setInitialData(this)
        },
      },
      methods: {
        dispatch: dispatch,
      },
    })
  }

  /**
   * 获取状态数据
   */
  function getState() {
    return rootState as State
  }

  /**
   *  提交 action
   */
  function dispatch(
    action: Action | AsyncAction,
    dispatchOption: DispatchOption = {
      lazy: true,
    }
  ) {
    let unwrap: <T = any>() => T | Promise<T> = () => null
    if (isFunc(action)) {
      const _action = action(
        {
          dispatch,
          getState,
        },
        dispatchOption
      )
      unwrap = () => _action
    } else {
      const moduleName = action.type.substring(0, action.type.indexOf('/'))
      const modules = Object.keys(rootState).sort()
      if (modules.indexOf(moduleName) === -1) {
        throw new Error(`[store] ${moduleName} 无效，有效 module ${modules}`)
      }
      const reducer = reducers[action.type]
      if (reducer) {
        if (option.debug) {
          console.debug('prev sate', rootState)
          console.debug('action', action)
        }
        const prevSate = rootState[moduleName]
        const nextSate = reducer(prevSate, action)
        rootState[moduleName] = cloneDeep(nextSate)

        const _components = components.filter(
          (v) => v.modules.indexOf(moduleName) !== -1 && (dispatchOption.lazy ? v.show : true)
        )
        _components.forEach((component) => {
          const _data = getSelectorState(component.selectors, moduleName)
          component.self.setData(_data)
        })

        if (option.debug) {
          console.debug('next sate', rootState)
        }
      }
    }
    return {
      unwrap,
    }
  }

  function getSelectorState(_selectors: ComponentSelectors, module = '') {
    let selectorState: IAnyObject = {}
    const selectors = _selectors.filter((v) => (module ? v[0] === module : true))
    selectors.forEach((selector) => {
      const moduleState = rootState[selector[0]]
      const moduleselector = selector[1]
      if (moduleselector) {
        if (isArray(moduleselector)) {
          moduleselector.forEach((key) => {
            selectorState[key as string] = moduleState[key]
          })
        } else {
          const keys = Object.keys(moduleselector).sort()
          keys.forEach((key) => {
            const fnVal = moduleselector[key]
            selectorState[key] = isFunc(fnVal) ? fnVal(moduleState) : moduleState[fnVal]
          })
        }
      } else {
        selectorState[selector[0]] = moduleState
      }
    })
    return cloneDeep(selectorState)
  }

  function getCompoent(self: ComponentSelf) {
    return components.filter((component) => component.self === self)[0]
  }

  /**
   * 绑定组件
   */
  function bindComponent(modules: string[], self: ComponentSelf, selectors: ComponentSelectors, show = false) {
    components.push({
      modules,
      self,
      show,
      selectors,
    })
  }

  /**
   * 组件，解除绑定
   */
  function unBindComponent(self: ComponentSelf) {
    components = components.filter((v) => v.self !== self)
  }

  /**
   * 切换组件状态
   */
  function componentToggleShow(self: ComponentSelf, show: Boolean) {
    const _self = components.filter((v) => v.self === self)[0]
    if (_self.show !== show) {
      _self.show = show
    }
  }

  return {
    dispatch,
    selector,
    getState,
  }
}
