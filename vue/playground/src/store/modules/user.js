import { UserService } from '@/common/api.service'
import {
  SIGN_IN,
} from '../actions'
import {
  SET_AUTH,
  SET_ERROR,
} from '../mutations'

const state = {
  isAuthenticated: false,
  user: {},
  errors: null,
}

const getters = {
  currentUser(state) {
    return state.user
  },
  isAuthenticated(state) {
    return state.isAuthenticated
  }
};

export const actions = {
  async [SIGN_IN](context, payload) {
    const { data } = await UserService.post(payload)
    if (data.status == '200') {
      context.commit(SET_AUTH, data.user)
    } else {
      context.commit(SET_ERROR)
    }
  },
}

export const mutations = {
  [SET_AUTH](state, user) {
    state.isAuthenticated = true
    state.user = user
    state.error = {}
  },
  [SET_ERROR](state, error) {
    state.error = error
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}