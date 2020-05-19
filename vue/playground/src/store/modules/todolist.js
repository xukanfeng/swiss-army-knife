import { TodoListService } from '@/common/api.service'
import {
  FETCH_TODOLIST,
  UPDATE_TODO,
} from '@/store/actions'
import {
  SET_TODOLIST,
  MODIFY_DESC,
  TOGGLE_STARED,
  COMPLETE_TODO,
} from '@/store/mutations'

const initialState = {
  todolist: [],
}

// 传进来的 state 和 这个文件中的 state 有什么区别？
const getTodoItem = (state, id) => {
  let todoItem = {}
  state.todolist.some(todo => { // 使用some、every或者forEach+try catch退出遍历
    if (todo.id == id) {
      todoItem = todo
      return true
    }
  })
  return todoItem
}

export const state = {...initialState}

export const actions = {
  // context 和 store具有相同方法和属性，可以用参数结构来获取commit方法
  async [FETCH_TODOLIST]({ commit }) {
    const { data } = await TodoListService.get()
    commit(SET_TODOLIST, data.todolist)
  },
  async [UPDATE_TODO](context, payload) {
    // put 请求返回的 data 是 return 的整个对象
    const { data } = await TodoListService.update(payload.id, payload)
    console.log(data)
  },
}

export const mutations = {
  [SET_TODOLIST](state, todolist) {
    state.todolist = todolist
  },
  [MODIFY_DESC](state, payload) {
    getTodoItem(state, payload.id).desc = payload.desc
  },
  [TOGGLE_STARED](state, id) {
    let todoItem = getTodoItem(state, id)
    todoItem.stared = !todoItem.stared
  },
  [COMPLETE_TODO](state, id) {
    getTodoItem(id).done = true
  }
}

const getters = {

}

export default {
  state,
  actions,
  mutations,
  getters,
}
