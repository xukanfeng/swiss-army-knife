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

    /*
    fn[Symbol.toPrimitive] = function () {
      return _args.reduce((acc, cur) => acc + cur)
    }
    */

    return fn
  }
  console.log("curry add", add(1)(2)(3, 4, 5)(6, 7))

  // 历史参数保存在绑定过的函数中，根据当前的参数数量和总共需要的参数数量判断是否结束
  function curry_v2(fn) {
    return function curried(...args) {
      if (args.length >= fn.length) {
        return fn.call(this, ...args)
      } else {
        return curried.bind(this, ...args)
      }
    }
  }
  const curryAdd_v2 = curry_v2(function (a, b, c, d, e) {
    console.log(a, b, c, d, e)
  })
  console.log("curry add", curryAdd_v2(1)(2, 3)(4, 5, 6))

  // 历史参数保存在 args 入参中传递，根据当前的参数数量和总共需要的参数数量判断是否结束
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
    console.log(a, b, c, d, e)
  })
  console.log("curry add", curryAdd_v3(1)(2, 3)(4, 5, 6))

  // 在 curry_v3 基础上增加 placeholder 功能
  const _ = Symbol('_') // 占位符
  function curry_with_padding(fn, ...args) {
    return function () {
      const newArgs = [...arguments]
      let i = 0,
        j = 0
      // 用新参数填充老参数中的 placeholder
      while (i < args.length && j < newArgs.length) {
        if (args[i] === _) {
          args[i] = newArgs[j]
          j++
        }
        i++
      }
      // 添加剩余的新参数
      args = args.concat(newArgs.slice(j))
      const placeholders = args.filter(arg => arg === _).length
      if (args.length - placeholders >= fn.length) {
        return fn.call(this, ...args)
      } else {
        return curry_with_padding(fn.bind(this), ...args)
      }
    }
  }
  const curryAdd_with_padding = curry_with_padding(function (a, b, c, d, e) {
    console.log(a, b, c, d, e)
  })
  console.log("curry add", curryAdd_with_padding(_, _, _)(1)(_, 3)(2)(4, 5))
}