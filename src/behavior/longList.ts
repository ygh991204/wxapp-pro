import { merge, omitBy } from 'lodash-es'
import type { IAnyObject } from '../type'

export type LongListOption = {
  request: (query?: IAnyObject) => Promise<{
    list: any[]
    count: number
  }>
  queryOnAttached?: boolean
  query?: IAnyObject
}

const defaultOption: LongListOption = {
  async request(query) {
    return {
      list: [],
      count: 0,
    }
  },
  queryOnAttached: true,
  query: {},
}

const HOOKS = {
  beforeRefresh: 'beforeRefresh',
  beforeReset: 'beforeReset'
}

export function createLongList(_option: LongListOption) {

  const option = merge(defaultOption, _option)

  const query = option.query ? { ...option.query } : {}

  let renderComplete = true

  const behavior = Behavior({
    data: {
      list: [],
      page: 1,
      count: 1,
      query,
    },

    lifetimes: {
      attached() {
        renderComplete = true
        if (option.queryOnAttached) {
          this.toQuery()
        }
      }
    },

    methods: {

      queryChange(key: string, val: any) {
        if (this.data.query[key] === val) {
          return
        }
        this.setData({
          ['query.' + key]: val,
        })
        this.toQuery()
      },

      async refresh() {
        if (renderComplete && this.data.count > this.data.list.length) {
          renderComplete = false
          const reslut = await option.request(this._getQueryParam())
          await this._renderData(reslut.list)
          renderComplete = true
          this.setData({
            page: this.data.page + 1,
            count: reslut.count,
          })
        }
      },

      async toQuery() {
        this.setData({
          page: 1,
        })
        await this.refresh()
      },

      async resetQuery() {
        await this._resetData()
        await this.toQuery()
      },

      _getQueryParam() {
        const query = {
          page: this.data.page,
          ...this.data.query,
        }
        return omitBy(query, (v) => v !== null && v !== undefined)
      },

      _resetData() {
        return new Promise((resolve) => {
          this.setData(
            {
              page: 1,
              query: { ...query },
              list: [],
              count: 1,
            },
            () => {
              resolve(null)
            }
          )
        })
      },

      _renderData(data = []) {
        return new Promise((resolve) => {
          const len = this.data.list.length
          const obj = {}
          data.forEach((v, i) => {
            obj['list[' + [i + len] + ']'] = v
          })
          this.setData(obj, () => {
            resolve(null)
          })
        })
      }

    }
  })

  return {
    behavior
  }
}
