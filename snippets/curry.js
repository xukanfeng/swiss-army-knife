{
  function add() {
    const _args = [...arguments]

    function fn() {
      _args.push(...arguments)
      return fn
    }

    fn.toString = function () {
      return _args.reduce((acc, cur) => acc + cur)
    }

    return fn
  }
  console.log("curry add", add(1)(2)(3, 4, 5)(6, 7))

  function curry_v1(fn) {
    const args = []
    return function result(...rest) {
      if (rest.length === 0) {
        return fn(...args)
      } else {
        args.push(...rest)
        return result
      }
    }
  }

  function curry_v2(fn, length) {
    length = length || fn.length // 使用 fn.length 获取函数参数个数
    return function (...args) {
      if (args.length >= length) {
        return fn.call(this, ...args)
      } else {
        return curry_v2(fn.bind(this, ...args), length - args.length)
      }
    }
  }
  const curryAdd = curry_v2(function (a, b, c, d, e) {
    return [...arguments].reduce((a, b) => a + b)
  })
  console.log("curry add", curryAdd(1)(2, 3)(4, 5))
}