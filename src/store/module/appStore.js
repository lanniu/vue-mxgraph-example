import {findIndex, equals, isNil} from 'ramda'
import vue from 'vue'

const appStore = {
  state: {
    sidebarCollapse: true,
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
    DELETE_TAG: (state, tag) => {
      const {name} = tag

      vue.delete(state.tagsContainer, name)
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
    },
    deleteOneTagFromContainer: ({commit}, tag) => {
      commit('DELETE_TAG', tag)
    }
  }
}

export default appStore
