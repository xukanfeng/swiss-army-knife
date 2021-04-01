{
  /**
   * 实现 add 函数
   */
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

  // 历史参数保存在绑定过的函数中，根据当前的参数数量和所需的剩余参数数量判断是否结束
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
  const curryAdd_v2 = curry_v2(function (a, b, c, d, e) {
    return [...arguments].reduce((a, b) => a + b)
  })
  console.log("curry add", curryAdd_v2(1)(2, 3)(4, 5, 6))

  // 历史参数保存在 args 入参中传递，根据总参数个数和总共需要的参数数量判断是否结束
  function curry_v3(fn, ...args) {
    return function () {
      args = [...args, ...arguments]
      if (args.length >= fn.length) {
        return fn.call(this, ...args)
      } else {
        return curry_v3(fn.bind(this), ...args)
      }
    }
  }
  const curryAdd_v3 = curry_v3(function (a, b, c, d, e) {
    return [...arguments].reduce((a, b) => a + b)
  })
  console.log("curry add", curryAdd_v3(1)(2, 3)(4, 5, 6))

  // 在 curry_v3 基础上增加 padding 功能
  const _ = '_' // 占位符
  function curry_with_padding(fn, ...args) {
    return function () {
      args = [...args, ...arguments]
      const holes = args.filter(arg => arg === _).length
      if (args.length - holes >= fn.length) {
        const right = args.slice(-holes)
        args.length = args.length - holes
        args.forEach((arg, i) => arg === _ && (args[i] = right.shift()))
        return fn.call(this, ...args)
      } else {
        return curry_with_padding(fn.bind(this), ...args)
      }
    }
  }
  const curryAdd_with_padding = curry_with_padding(function (a, b, c, d, e) {
    return [...arguments].reduce((a, b) => a + b)
  })
  console.log("curry add", curryAdd_with_padding(_)(2, _)(4, 5)(1)(3))

  function curry_v4(fn) {
    return function curried(...args) {
      if (args.length >= fn.length) {
        return fn.call(this, ...args)
      } else {
        return curried.bind(this, ...args)
      }
    }
  }
}