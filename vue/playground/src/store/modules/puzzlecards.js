import {
  PuzzleCardsService
} from '@/common/api.service'
import {
  FETCH_PUZZLES,
  ADD_PUZZLE,
} from '@/store/actions'
import {
  SET_PUZZLES,
} from '@/store/mutations'

const initialState = {
  puzzles: [],
}

export const state = {
  ...initialState
}

export const actions = {
  async [FETCH_PUZZLES]({ commit}, payload) {
    // const { data } = await PuzzleCardsService.get(payload.currentUser.name)
    const { data } = await PuzzleCardsService.query(payload)
    commit(SET_PUZZLES, data.puzzles)
  },
  async [ADD_PUZZLE](context, payload) {
    const { data } = await PuzzleCardsService.post(payload)
    console.log(data)
  },
}

export const mutations = {
  [SET_PUZZLES](state, puzzles) {
    state.puzzles = puzzles
  },
}

export const getters = {
  puzzles(state) {
    return state.puzzles
  }
}

export default {
  state,
  actions,
  mutations,
  getters,
}
