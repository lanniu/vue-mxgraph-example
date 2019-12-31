import Vue from 'vue'
import Vuex from 'vuex'
import appStore from '@/store/module/appStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {appStore}
})
