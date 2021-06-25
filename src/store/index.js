import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 收缩/扩张导航栏
    isCollapse: false,
    // tags标签数组
    tags: [
      { path: 'webmain', authName: '首页' }
    ],
    // 当前点击标签
    currentMenu: null
  },
  mutations: {
    isCollapse (state, status) {
      state.isCollapse = status
    },
    addTags (state, tag) {
      if (tag.name !== '首页') {
        state.currentMenu = tag
        state.currentMenu = tag
        console.log('currenrMenu', state.currentMenu)
        const result = state.tags.findIndex(item => item === tag) // 去重
        result === -1 ? state.tags.push(tag) : ''
      } else {
        state.currentMenu === null
      }
    },
    delTag (state, tag) {
      const result = state.tags.findIndex(item => item.authName === tag.authName)
      state.tags.splice(result, 1)
    }
  },
  actions: {

  },
  modules: {
  }
})
