{
  function debounce(fn, interval) {
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
  // o.b = debounce(o.a, 1000)

  function throttle(fn, interval) {
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

  function throttle_v2(fn, interval) {
    let prev = Date.now()
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
}