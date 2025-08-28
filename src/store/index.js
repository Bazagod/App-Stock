import { createStore } from 'vuex'
import auth from './modules/auth'
import stock from './modules/stock'

export default createStore({
  modules: {
    auth,
    stock
  }
})