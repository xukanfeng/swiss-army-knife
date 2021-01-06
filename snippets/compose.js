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
        console.log("enter plus1")
        const res = await next(n + 1) // 每一层对传入的值进行处理后传入 next； 对应把 action 传入 dispatch
        console.log("leave plus1")
        return res
    }
    const plus2 = next => async n => {
        console.log("enter plus2")
        const res = await next(n + 2)
        console.log("leave plus2")
        return res
    }
    // 这里的 next 是 plus4(double) 的返回值，即 n => {}
    const plus3 = next => async n => {
        console.log("enter plus3")
        const res = await next(n + 3)
        console.log("leave plus3")
        return res
    }
    // 这里的 next 是 double
    const plus4 = next => async n => {
        console.log("enter plus4")
        const res = await next(n + 4)
        console.log("leave plus4")
        return res
    }
    const double = async n => {
        console.log("enter double")
        const res = await new Promise(resolve => setTimeout(() => resolve(2 * n), 2000)) // 进入洋葱圈核心
        console.log("leave double")
        return res // 将处理结果往外传
    }

    function compose(funcs) {
        // next 会作为 args 传入
        return funcs.reduce((a, b) => (...args) => a(b(...args)))
    }
    const plusThenDouble = compose([plus1, plus2, plus3, plus4])(double) // double 就是 next
    plusThenDouble(0).then(res => console.log(res))
}