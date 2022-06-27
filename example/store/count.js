

import { Wex } from '../dist/index'

const count = Wex.createModule({
  name: 'count',
  initialState: {
    count: 1
  },
  reducers: {
    increase(state, { payload = 1 }){
      return {
        count: state.count + payload
      }
    }
  }
})

export const { increase } = count.actions

export default count.reducer