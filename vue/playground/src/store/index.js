import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const files = require.context('./modules', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

import _ from 'lodash'
// Vuex 插件就是一个函数，接收 store 作为唯一参数
const myPlugin = store => {
  // store 初始化后调用
  // 插件可用于比较 State 快照
  // eslint-disable-next-line no-unused-vars
  let prevState = _.cloneDeep(store.state)
  store.subscribe((mutation, state) => {
    // 每次 mutation 之后调用
    let nextState = _.cloneDeep(state)
    // mutation: { type, payload }
    if (mutation.type === 'xxx') {
      'do xxx'
    }

    // 比较 prevState & nextState...
    prevState = nextState
  })
}

export default new Vuex.Store({
  plugins: [myPlugin], // 这个选项暴露出每次 mutation 的钩子
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: modules,
})
