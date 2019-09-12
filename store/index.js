import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import adminuser from './modules/adminuser'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    adminuser
  },
  getters
})

export default store
