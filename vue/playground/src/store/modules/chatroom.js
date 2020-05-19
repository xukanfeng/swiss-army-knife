import {
  INIT_USER_LIST,
  UPDATE_USER_LIST,
  UPDATE_MSG_LIST,
} from '@/store/mutations'

const initialState = {
  userList: [],
  msgList: [],
}

export const state = {
  ...initialState,
}

export const getters = {
  userList(state) {
    return state.userList
  },
  msgList(state) {
    return state.msgList
  },
}

export const mutations = {
  [INIT_USER_LIST](state, userList) {
    state.userList = userList
  },
  [UPDATE_USER_LIST](state, payload) {
    if (payload.status === 'join') {
      for (let user of state.userList) {
        if (user.name === payload.user.name) {
          return
        }
      }
      state.userList.push(payload.user)
    }
    if (payload.status === 'left') {
      for (let [index, user] of state.userList.entries()) {
        if (user.name === payload.user.name) {
          state.userList.splice(index, 1)
          break
        }
      }
    }
  },
  [UPDATE_MSG_LIST](state, payload) {
    state.msgList.push(payload)
  },
}

export default {
  state,
  getters,
  mutations,
}