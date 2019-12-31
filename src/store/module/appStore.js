import {findIndex, equals, isNil} from 'ramda'
import vue from 'vue'

const appStore = {
  state: {
    sidebarCollapse: false,
    tagsContainer: {}
  },
  getters: {
    sidebarCollapse: (state) => {
      return state.sidebarCollapse
    },
    tagsContainer: (state) => {
      return state.tagsContainer
    }
  },
  mutations: {
    setSidebarCollapse: (state, collapse) => {
      state.sidebarCollapse = collapse
    },
    addOneTagFromContainerById: () => {

    },
    ADD_TAG: (state, tag) => {
      const {name} = tag

      if (isNil(state.tagsContainer[name])) {
        vue.set(state.tagsContainer, name, tag)
      }
    }
  },
  actions: {
    addOneTagToContainer: ({commit, state}, tag) => {
      const {name} = tag

      commit('ADD_TAG', tag)
      return findIndex(equals(name), Object.keys(state.tagsContainer))
    }
  }
}

export default appStore
