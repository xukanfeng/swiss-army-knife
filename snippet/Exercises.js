this.log = undefined
this.log = (func, params) => {
    console.log("result of [", func.name, "] is: ", func(params))
}

// 基础语法
{
    const arr = [1, [2, [3, [4, 5]]], 6]

    const flatten1 = arr => {
        return arr.reduce((prev, cur) => {
            return prev.concat(Array.isArray(cur) ? flatten1(cur) : cur)
        }, [])
    }
    this.log(flatten1, arr)
}

{
    const arr = [1, 1, '1', 17, true, true, false, false, 'true', 'a', {}, {}]
    // console.log(Array.from(new Set(arr)))
    const unique1 = (arr, res = []) => {
        arr.forEach((item, index) => arr.indexOf(item) === index && res.push(item))
        return res
    }
    this.log(unique1, arr)

    const unique2 = (arr, res = []) => {
        arr.forEach(item => !res.includes(item) && res.push(item))
        return res
    }
    this.log(unique2, arr)

    const unique3 = (arr, res = []) => {
        return arr.filter((item, index) => {
            return arr.indexOf(item) === index
        })
    }
    this.log(unique3, arr)
}

{
    // Array.from
    // Array.prototype.slice.call()
    // Array.prototype.concat.apply([], )
    // ...
}

// 柯里化
{
    function add() {
        const _args = [...arguments]

        function fn() {
            _args.push(...arguments)
            return fn
        }

        fn.toString = function() {
            return _args.reduce((acc, cur) => acc + cur)
        }

        return fn
    }
    console.log(add(1)(2)(3, 4, 5)(6, 7))
}

// Object
{
    const person = {
        name: 'alice'
    }
    const student = function(age) {
        this.age = age
        console.log(this.name, 'is', age)
    }
    student.prototype.sayHi = function() {
        console.log('my name is', this.name, 'and my age is', this.age)
    }

    // function.apply(thisArg, [argsArray])
    Function.prototype.myApply = function(context = window, args) {
        if (typeof this !== 'function')
            throw new TypeError()

        const fn = Symbol('fn')
        context[fn] = this
        const res = context[fn](...args)
        delete context[fn]
        return res
    }
    student.myApply(person, [18])

    // function.call(thisArg, arg1, arg2, ...)
    Function.prototype.myCall = function(context = window, ...args) {
        const fn = Symbol('fn')
        context[fn] = this
        const res = context[fn](...args)
        delete context[fn]
        return res
    }
    student.myCall(person, 20)

    // function.bind(thisArg, arg1, arg2, ...)
    Function.prototype.myBind = function(context = window, ...args) {
        const self = this
        // new会改变this指向：如果bind绑定后的函数被new了，那么this指向会发生改变，指向当前函数的实例
        const fn = function() {
            self.apply(this instanceof self ? this : context, [...args, ...arguments])
        }
        // 继承原型上的属性和方法
        fn.prototype = Object.create(self.prototype)
        return fn
    }
    const fn = student.myBind(person)
    new fn(22).sayHi()
    fn(22)
}

{
    /*
           obj      Foo
            |       /
            v      v
      Foo.prototype
            |
            v
    */
    function myNew(Foo, ...args) {
        const obj = Object.create(Foo.prototype)
        const res = Foo.apply(obj, args)
        return Object.prototype.toString.call(res) === '[object Object]' ?
                res : obj
    }
    function Boo(name) {
        this.name = name
        return {
            age: 18
        }
    }
    const boo = myNew(Boo, 'alice')
    console.log(boo)
}

{
    function myInstanceof(instance, obj) {
        // 基本数据类型返回 false
        if (typeof instance !== 'object' || instance === null) return false

        let proto = Object.getPrototypeOf(instance)
        while(true) {
            if (proto === null) return false
            if (proto === obj.prototype) return true
            proto = Object.getPrototypeOf(proto)
        }
    }
    console.log('myInstanceof test:', myInstanceof(10, Object), myInstanceof({a: 1}, Object))
}


// Promise
{
    async function asyncPool(tasks, poolLimit) {
        const result = [];
        const executing = [];
        for (let task of tasks) {
            const promise = Promise.resolve(task())
            // promise resolve 后，结果保存在 result中
            result.push(promise)
            // 保存正在执行的 promise
            executing.push(promise)
            promise.then(() => executing.splice(executing.indexOf(promise), 1))
            if (executing.length >= poolLimit) {
                await Promise.race(executing)
            }
        }
        return Promise.all(result);
    }

    const timeout = i => new Promise(resolve => setTimeout(() => { /*console.log(i);*/ resolve(i) }, i));
    (async () => {
        const results = await asyncPool([
            () => timeout(10),
            () => timeout(50),
            () => timeout(30),
            () => timeout(20)], 2);
        console.log('asyncPool', results)
    })();
}

// 框架
{
    const vnode = {
        tag: '',
        attr: '',
        children: []
    }

    function render(vnode, container) {
        container.appendChild(createNode(vnode))
    }
    function createNode(vnode) {
        if (typeof vnode === 'string') {
            return document.createTextNode(vnode)
        }
        const dom = document.createElement(vnode.tag)
        if(vnode.attr) {
            Object.entries(vnode.attr).forEach(entry => {
                dom.setAttribute(entry[0], entry[1])
            })
        }
        vnode.children.forEach(child => render(child, dom))
        return dom
    }
}

// 其他
{
    function debounce(fn, interval) {
        let timer = null
        return function() {
            const context = this
            const args = arguments

            if (timer) clearTimeout(timer)
            timeout = setTimeout(() => {
                // 原函数作为参数传递时，会作为普通函数处理，不管是否挂载在某个对象上
                fn.apply(context, args)
            }, interval)
        }
    }
    // o.b = debounce(o.a, 1000)

    function throttle(fn, interval) {
        let timer = null
        return function() {
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
}

