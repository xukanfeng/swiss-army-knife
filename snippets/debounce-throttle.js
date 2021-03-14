{
  function debounce_v1(fn, interval) {
    let timer = null
    return function () {
      const context = this
      const args = arguments

      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        // 原函数作为参数传递时，会作为普通函数处理，不管是否挂载在某个对象上
        fn.apply(context, args)
      }, interval)
    }
  }

  function debounce_v2(fn, interval, immediate) {
    let result
    let timer = null
    const debounced = function () {
      const context = this
      const args = arguments

      if (timer) clearTimeout(timer)
      if (immediate) {
        const callNow = !timer
        timer = setTimeout(() => {
          timer = null
        }, interval)
        if (callNow) result = fn.apply(context, args)
      } else {
        timer = setTimeout(() => {
          // 原函数作为参数传递时，会作为普通函数处理，不管是否挂载在某个对象上
          fn.apply(context, args)
        }, interval)
      }
      // 只有立即执行时，返回值才有意义，否则在函数在延时后执行，返回值必定为 undefined
      return result
    }

    debounced.cancel = function () {
      clearTimeout(timer)
      timer = null
    }

    return debounced
  }

  // 事件停止触发后会再执行一次
  function throttle_v1(fn, interval) {
    let timer = null
    return function () {
      const context = this
      const args = arguments

      if (!timer) {
        timer = setTimeout(() => {
          timer = null
          fn.apply(context, args)
        }, interval)
      }
    }
  }

  // 第一次会立即执行，因为第一次 now 必定大于 prev（0）
  function throttle_v2(fn, interval) {
    let prev = 0
    return function () {
      const context = this
      const args = arguments

      let now = Date.now()
      if (now - prev >= interval) {
        fn.apply(context, args)
        prev = Date.now()
      }
    }
  }

  function throttle_v3(fn, interval, options = {leading: true, trailing: true}) {
    if (!options.leading && options.trailing) return throttle_v1(fn, interval)
    if (options.leading && !options.trailing) return throttle_v2(fn, interval)

    let timer = null
    let prev = 0
    return function () {
      const context = this
      const args = arguments

      if (!timer) {
        timer = setTimeout(() => {
          timer = null
          fn.apply(context, args)
          // 保证后续不会执行下面代码
          prev = Date.now()
        }, interval)

        // 第一次立即执行
        let now = Date.now()
        // 考虑定时器触发后，interval 间隔内函数又被调用的场景，此时 now - prev >= interval 的判断会导致第一次立即执行的逻辑失效
        if (now - prev >= interval) {
          fn.apply(context, args)
          // prev = Date.now() // 移到 timerout 里更新
        }
      }
    }
  }

  const throttled = throttle_v3(() => console.log(Date.now()), 3000)
  setInterval(() => {
    console.log('timeup')
    throttled()
  }, 1000)
}