{
  function useRetriableSync(fn, n) {
    return (...args) => {
      try {
        return fn.call(null, ...args)
      } catch (err) {
        if (n-- > 0) {
          return useRetriableSync(fn, n)(...args)
        } else {
          throw new Error('error')
        }
      }
    }
  }

  function useRetriableAsync(fn, n) {
    return (...args) => fn.call(null, ...args)
      .then(res => res)
      .catch(err => {
        if (n-- > 0) {
          return useRetriableAsync(fn, n)(...args)
        } else {
          throw new Error('error')
        }
      })
  }

  // 使用 Promise.try 可以无视 fn 是同步或者异步。但是使用 Promise.try 之后，会改变同步函数原来的调用方式，需要使用 await 才能取到结果
  Promise.try = function (fn) {
    return new Promise((resolve, reject) => resolve(fn()))
  }

  function useRetriable(fn, n) {
    return (...args) => Promise.try(() => fn.call(null, ...args))
      .then(res => res)
      .catch(err => {
        if (n-- > 0) {
          return useRetriable(fn, n)(...args)
        } else {
          throw new Error('error')
        }
      })
  }

  // test cases
  let syncRetries = 0

  function syncFoo(arg) {
    console.log('syncFoo', arg)
    if (syncRetries++ < 1)
      throw new Error('syncFoo error')
    else
      return 'syncFoo done'
  }
  let asyncRetries = 0

  function asyncFoo(arg, delay) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('asyncFoo', arg)
        if (asyncRetries++ < 1)
          reject('asyncFoo error')
        else
          resolve('asyncFoo done')
      }, delay)
    })
  }

  async function test() {
    try {
      let res
      const retriableSyncFoo = useRetriable(syncFoo, 3)
      res = await retriableSyncFoo('boo')
      console.log('retriableSyncFoo', res)

      const retriableAsyncFoo = useRetriable(asyncFoo, 3)
      res = await retriableAsyncFoo('boo', 2000)
      console.log('retriableAsyncFoo', res)
    } catch (err) {
      console.log(err)
    }

  }
  test()
}