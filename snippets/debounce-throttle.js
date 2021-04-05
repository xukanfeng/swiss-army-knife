{
  function debounce_v1(fn, wait) {
    let timer = null
    return function (...args) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, wait)
    }
  }

  function debounce_v2(fn, wait, option = {
    leading: true,
    trailing: true
  }) {
    let timer = null
    let lastArgs = null
    return function (...args) {
      // 增加每个周期首次执行的判断
      if (!timer && option.leading) {
        fn.apply(this, args)
      } else {
        lastArgs = args
      }

      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        if (option.trailing && lastArgs) fn.apply(this, lastArgs)
        // 重置参数，为下个周期做准备
        timer = null
        lastArgs = null
      }, wait)
    }
  }

  function debounce_v3(fn, wait, immediate) {
    let result
    let timer = null
    const debounced = function (...args) {
      if (timer) clearTimeout(timer)
      if (immediate) {
        const callNow = !timer
        timer = setTimeout(() => {
          timer = null
        }, wait)
        if (callNow) result = fn.apply(this, args)
      } else {
        timer = setTimeout(() => {
          fn.apply(this, args)
        }, wait)
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

  // 周期刚开始时会执行一次，如果周期刚结束后又马上开始，在周期相邻出会多执行一次
  function throttle_v1(fn, wait) {
    let timer = null
    let lastArgs = null
    return function (...args) {
      if (timer) {
        lastArgs = args
      } else {
        fn.apply(this, args)
        timer = setTimeout(() => {
          if (lastArgs) {
            fn.apply(this, args)
            timer = null
          }
        }, wait)
      }
    }
  }

  function throttle_v2(fn, wait, option = {
    leading: true,
    trailing: true
  }) {
    let timer = null
    let lastArgs = null
    return function (...args) {
      if (timer) {
        lastArgs = args
      } else {
        if (option.leading) {
          fn.apply(this, args)
        } else {
          lastArgs = args
        }
        const timeout = () => {
          // options.trailing === true 时，lastArgs = null，再次执行 setTimeout 时，会进入 else 处理，
          // 使得 timer = null，最终逻辑等同于 v1中 的 setTimeout 处理
          // options.trailing === false 时，直接进入else处理，使得 timer = null，下一周期开始时，又会直接执行函数
          if (options.trailing && lastArgs) {
            func.apply(lastContext, lastArgs)
            timer = setTimeout(timeout, wait)
            lastArgs = null
          } else {
            timer = null
          }
        }
        timer = setTimeout(timeout, wait)
      }
    }
  }

  // 只用时间戳时，第一次会立即执行，因为第一次 now 必定大于 prev（0），但是会丢失最后一次的执行
  function throttle_v3(fn, wait) {
    let prev = 0
    return function (...args) {
      let now = Date.now()
      if (now - prev >= wait) {
        fn.apply(this, args)
        prev = Date.now()
      }
    }
  }

  const throttled = throttle_v3(() => console.log(Date.now()), 3000)
  setInterval(() => {
    console.log('timeup')
    throttled()
  }, 1000)
}