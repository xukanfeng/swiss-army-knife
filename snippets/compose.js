{
    const plus1 = next => n => {
        console.log("enter plus1")
        const res = next(n + 1) // 每一层对传入的值进行处理后传入 next； 对应把 action 传入 dispatch
        console.log("leave plus1")
        return res
    }
    const plus2 = next => n => {
        console.log("enter plus2")
        const res = next(n + 2)
        console.log("leave plus2")
        return res
    }
    // 这里的 next 是 plus4(double) 的返回值，即 n => {}
    const plus3 = next => n => {
        console.log("enter plus3")
        const res = next(n + 3)
        console.log("leave plus3")
        return res
    }
    // 这里的 next 是 double
    const plus4 = next => n => {
        console.log("enter plus4")
        const res = next(n + 4)
        console.log("leave plus4")
        return res
    }
    const double = n => {
        console.log("enter double")
        const res = 2 * n // 进入洋葱圈核心
        console.log("leave double")
        return res // 将处理结果往外传
    }

    function compose(funcs) {
        // next 会作为 args 传入
        return funcs.reduce((a, b) => (...args) => a(b(...args)))
    }
    const plusThenDouble = compose([plus1, plus2, plus3, plus4])(double) // double 就是 next
    // plusThenDouble(0)
}

// 异步版本
{
    const plus1 = next => async n => {
        console.log("enter plus1", n)
        const res = await next(n + 1) // 每一层对传入的值进行处理后传入 next； 对应把 action 传入 dispatch
        console.log("leave plus1", res)
        return res
    }
    const plus2 = next => async n => {
        console.log("enter plus2", n)
        const res = await next(n + 2)
        console.log("leave plus2", res)
        return res
    }
    // 这里的 next 是 plus4(double) 的返回值，即 n => {}
    const plus3 = next => async n => {
        console.log("enter plus3", n)
        const res = await next(n + 3)
        console.log("leave plus3", res)
        return res
    }
    // 这里的 next 是 double
    const plus4 = next => async n => {
        console.log("enter plus4", n)
        const res = await next(n + 4)
        console.log("leave plus4", res)
        return res
    }
    const double = async n => {
        console.log("enter double", n)
        const res = await new Promise(resolve => setTimeout(() => resolve(2 * n), 2000)) // 进入洋葱圈核心
        console.log("leave double", res)
        return res // 将处理结果往外传
    }

    function compose(funcs) {
        // next 会作为 args 传入
        return funcs.reduce((a, b) => (...args) => a(b(...args)))
    }
    const plusThenDouble = compose([plus1, plus2, plus3, plus4])(double) // double 就是 next
    // plusThenDouble(0).then(res => console.log(res))
}

{
    // koa-compose
    const plus1 = async (context, next) => {
        console.log("enter plus1")
        const res = await next()
        console.log("leave plus1")
        return res
    }
    const plus2 = async (context, next) => {
        console.log("enter plus2")
        const res = await next()
        console.log("leave plus2")
        return res
    }
    const plus3 = async (context, next) => {
        console.log("enter plus3")
        const res = await next()
        console.log("leave plus3")
        // return res // 任何一个中间件没有返回值就可以阻止返回值往外传
    }
    const double = async context => {
        console.log("enter double")
        const res = await new Promise(resolve => setTimeout(() => resolve('done'), 2000)) // 进入洋葱圈核心
        console.log("leave double")
        return res
    }

    function compose (middleware) {
      return function (context, next) {
        // last called middleware #
        let index = -1
        return dispatch(0)
        function dispatch (i) {
          if (i <= index) return Promise.reject(new Error('next() called multiple times'))
          index = i
          let fn = middleware[i]
          if (i === middleware.length) fn = next
          if (!fn) return Promise.resolve()
          try {
            // koa 中每个中间件的入参是固定的 context
            // 每个中间件没有义务返回函数值，并且最外层的处理函数也不关心函数返回值，最终处理的结果通过 context 引用传出
            return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
          } catch (err) {
            return Promise.reject(err)
          }
        }
      }
    }
    const plus = compose([plus1, plus2, plus3])
    // plus().then(res => console.log(res)) // undefined

    const plusThenDouble = compose([plus1, plus2, plus3])
    // plusThenDouble(undefined, double).then(res => console.log(res))
}