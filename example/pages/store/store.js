// pages/store/store.js

import store from '../../store/index'
import { increase } from '../../store/count'

const storeSelect = store.selector(['count', {
  countCount: count => count.count * 2
}])

Component({
  behaviors: [storeSelect],
  data: {

  },
  methods: {
    countCountAdd(){
      this.dispatch(increase(5))
    }
  }
})