import type { Module, ModuleActions, ModuleMutations } from './createModule'
import type { RootState, ComponentSelectors, ComponentSelf, Component } from './type'

export function createStore<State extends RootState = RootState>(modules: Module[]) {
  const rootState = {}
  const rootMutations = {} as ModuleMutations
  const rootActions = {} as ModuleActions
  const components: Component[] = []

  for (let i = 0; i < modules.length; i++) {
    rootState[modules[i].name] = modules[i].state
    const actions = modules[i].actions
    const mutations = modules[i].mutations
    for (const key in actions) {
      rootActions[key] = actions[key]
    }
    for (const key in mutations) {
      rootMutations[key] = mutations[key]
    }
  }

  function parseType(type = '') {
    return type.split('/')
  }

  /**
   * 提交 mutation
   */
  function commit(type: string, payload: any, lazy = true) {
    const [moduleName] = parseType(type)
    const prevState = rootState[moduleName]
    const nextSate = rootMutations[type](prevState, payload)
    rootState[moduleName] = nextSate
    for (let i = 0; i < components.length; i++) {
      const { self, show, selectors } = components[i]
      const _selectors = selectors.filter((selector) => selector[0] === moduleName)
      if (selectors.length && (lazy ? show : true)) {
        setDataComponent(self, _selectors)
      }
    }
    return nextSate
  }

  function getState() {
    return rootState as State
  }

  /**
   * 提交 action
   */
  function dispatch(type: string, paylod: any, lazy = true) {
    const [moduleName] = parseType(type)
    function moduleCommit(type: string, payload: any) {
      return commit(moduleName + '/' + type, payload, lazy)
    }
    function moduleDispatch(type: string, payload: any) {
      return dispatch(moduleName + '/' + type, payload, lazy)
    }
    return rootActions[type](
      {
        state: rootState[moduleName],
        rootState: getState(),
        commit: moduleCommit,
        dispatch: moduleDispatch,
      },
      paylod
    )
  }

  /**
   * 更新组件数据
   */
  function setDataComponent(self: ComponentSelf, selectors: ComponentSelectors) {
    const data = {}
    for (let i = 0; i < selectors.length; i++) {
      const selector = selectors[i]
      const module = selector[0]
      const moduleState = rootState[module]
      const moduleSelector = selector[1]
      if (moduleSelector) {
        if (Array.isArray(moduleSelector)) {
          for (let j = 0; j < moduleSelector.length; j++) {
            const selectorVal = moduleState[moduleSelector[j]]
            data[moduleSelector[j]] = selectorVal === undefined ? null : selectorVal
          }
        } else {
          for (const selectorKey in moduleSelector) {
            const selectorVal = moduleSelector[selectorKey]
            const selectorValData =
              typeof selectorVal === 'function' ? selectorVal(moduleState) : moduleState[selectorVal]
            data[selectorKey] = selectorValData === undefined ? null : selectorValData
          }
        }
      } else {
        data[module] = moduleState
      }
    }
    const setData = {}
    for (const dataKey in data) {
      if (self.data[dataKey] !== data[dataKey]) {
        setData[dataKey] = data[dataKey]
      }
    }
    if (Object.keys(setData).length) {
      self.setData(setData)
    }
  }

  /**
   * 将对应的状态绑定至组件
   */
  function mapState(...selectors: ComponentSelectors) {
    return Behavior({
      pageLifetimes: {
        show() {
          const _self = getComponent(this)
          if (_self && !_self.show) {
            componentToggleShow(this, true)
            setDataComponent(this, selectors)
          }
        },
        hide() {
          componentToggleShow(this, false)
        },
      },
      lifetimes: {
        created() {
          bindComponent(this, selectors, true)
        },
        attached() {
          setDataComponent(this, selectors)
        },
        detached() {
          unBindComponent(this)
        },
      },
    })
  }

  /**
   * 获取组件
   */
  function getComponent(self: ComponentSelf) {
    let component = null
    for (let i = 0; i < components.length; i++) {
      if (components[i].self === self) {
        component = components[i]
        break
      }
    }
    return component
  }

  /**
   * 绑定组件
   */
  function bindComponent(self: ComponentSelf, selectors: ComponentSelectors, show: Boolean) {
    components.push({
      self,
      show,
      selectors,
    })
  }

  /**
   * 卸载组件
   */
  function unBindComponent(self: ComponentSelf) {
    for (let i = 0; i < components.length; i++) {
      if (components[i].self === self) {
        components.splice(i, 1)
        break
      }
    }
  }

  /**
   * 设置组件状态
   */
  function componentToggleShow(self: ComponentSelf, show: boolean) {
    const _self = getComponent(self)
    if (_self && _self.show !== show) {
      _self.show = show
    }
  }

  return {
    getState,
    mapState,
    dispatch,
    commit,
  }
}
