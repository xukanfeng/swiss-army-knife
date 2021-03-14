{
  const reducers = {
    // state 可以在 createStore 第二个参数中赋初值，或者在 reducer 的第一个参数中赋初值
    // 因为第一次 dispatch INIT 时，给 reducer 的是 createStore 参数中的默认 state，所以如果两个地方都赋值了，取前者
    // 使用复合的 reducer 时，每个 reducer 必须指定默认 state
    reducers1: (state, action) => {},
    reducers2: (state, action) => {}
  }
  // 对应生成的 state
  const state = {
    reducer1: {},
    reducer2: {}
  }

  // 把一个由多个不同 reducer 函数作为 value 的 object，合并成一个最终的 reducer 函数 
  // 然后就可以对这个 reducer 调用 createStore
  function combineReducers(reducers) {
    return function (state = {}, action) {
      return Object.keys(reducers).reduce((nextState, key) => {
        // 第一次初始化时，state[key] === undefined，会使用每个 reducer 声明中的默认参数值
        nextState[key] = reducers[key](state[key], action)
        return nextState
      }, {})
    }
  }
}

{
  function compose(...funcs) {
    if (funcs.length === 0)
      return args => args
    if (funcs.length === 1)
      return funcs[0]
    
    return funcs.reduce((a, b) => (...args) => a(b(...args)))
  }
}

{
  /**
   * redux-thunk
   */
  const thunk = ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }
    return next(action)
  }
}