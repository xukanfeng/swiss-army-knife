import request from '../utils/request';
import { message } from 'antd';

const delay = millisecond => {
  return new Promise(resolve => {
    setTimeout(resolve, millisecond)
  })
}

export default {
  namespace: 'PuzzleCards',
  state: {
    data: [],
    counter: 0,
  },
  effects: {
    *queryInitCards(_, sagaEffects) {
      const { call, put } = sagaEffects
      const endPointUrl = '/dev/random_joke'
      try {
        const puzzle = yield call(request, endPointUrl)
        yield call(delay, 0) 
        yield put({
          type: 'addCard',
          payload: puzzle,
        })
      } catch (e) {
       message.error('数据获取失败:' + e)
      }
    }
  },
  reducers: {
    addCard(state, {payload: puzzle}) {
      const nextCounter = state.counter + 1
      if (JSON.stringify(puzzle) == '{}') {
        puzzle = {
          setup: 'what\'s the id of this card?',
          punchline: `this is #${nextCounter} card`,
        }
      }
      const newCard = {
        ...puzzle,
        id: nextCounter,
      }
      const nextData = state.data.concat(newCard)
      return {
        data: nextData,
        counter: nextCounter,
      }
    }
  }
}