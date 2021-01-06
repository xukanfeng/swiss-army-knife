{
  const reducers = {
    reducers1: (state, action) => {},
    reducers2: (state, action) => {}
  }

  // 把一个由多个不同 reducer 函数作为 value 的 object，合并成一个最终的 reducer 函数 
  // 然后就可以对这个 reducer 调用 createStore
  function combineReducers(reducers) {
    return function (state = {}, action) {
      return Object.keys(reducers).reduce((nextState, key) => {
        nextState[key] = reducers[key](state[key], action)
        return nextState
      }, {})
    }
  }
}