/* eslint-disable no-unused-vars */
export const actions = {
  someAction({ state, commit, dispatch, rootState, getters, rootGetters }) {
    dispatch('someOtherAction') // 本模块的 action
    dispatch('someOtherAction', null, { root: true }) // 接收 root 属性来访问根 dispatch

    commit('someMutation')
    commit('someMutation', null, { root: true })
  },
  // 在带命名空间的模块内注册全局 action
  globalAction: {
    root: true,
    // 在 handler 中定义 action
    handler(namespacedContext, payload) {

    }
  }
}

export const getters = {
  // getter 接受其他 getter 作为第二个参数
  someGetter(state, getters, rootState, rootGetter) {
    let boo = getters.someOtherGetter
  },
  getterWithParams: state => params => 'handle params'
}

// 带命名空间的绑定函数示例
/*
{
  computed: {
    ...mapState('some/nested/module', {
      a: state => state.a,
      b: state => state.b,
    })
  },
}

or:

import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')
*/

export default {
  namespaced: true, // 带命名空间的模块
  actions,
  getters,
}