{
  const person = {
    name: 'alice'
  }
  const student = function (age) {
    this.age = age
    console.log(this.name, 'is', age)
  }
  student.prototype.sayHi = function () {
    console.log('my name is', this.name, 'and my age is', this.age)
  }

  // function.apply(thisArg, [argsArray])
  Function.prototype.myApply = function (context = window, args) {
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
  Function.prototype.myCall = function (context = window, ...args) {
    if (typeof this !== 'function')
      throw new TypeError()

    const fn = Symbol('fn')
    context[fn] = this
    const res = context[fn](...args)
    /*
    let args = []
    for (let i = 1; i < arguments.length; i++) {
      args.push('arguments[' + i + ']')
    }
    const res = eval('context.fn(' + args + ')')
    */
    delete context[fn]
    return res
  }
  student.myCall(person, 20)

  // function.bind(thisArg, arg1, arg2, ...)
  Function.prototype.myBind = function (context = window, ...args) {
    if (typeof this !== 'function')
      throw new TypeError()

    const self = this
    // new会改变this指向：如果bind绑定后的函数被new了，那么this指向会发生改变，指向当前函数的实例
    const fn = function () {
      if (!self.prototype) throw new TypeError() // 箭头函数 new 时应该抛出异常
      return self.apply(this instanceof self /* new.target */ ? this : context, [...args, ...arguments])
    }
    // 继承原型上的属性和方法
    if (self.prototype) // 箭头函数没有 prototype
      fn.prototype = Object.create(self.prototype)
    return fn
  }
  const fn = student.myBind(person)
  new fn(22).sayHi()
  fn(22)
}

{
  Object.prototype.myCreate = function (obj) {
    const Fn = function () {}
    Fn.prototype = obj
    const fn = new Fn()
    if (obj)
      fn.constructor = Fn
    return fn
  }
  const a = {
    x: 1
  }
  console.log('Object.create', Object.create(a))
  console.log('Object.myCreate', Object.myCreate(a))
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
  }

  function BooWithReturn(name) {
    this.name = name
    return {
      age: 18
    }
  }
  const boo1 = myNew(Boo, 'alice')
  console.log('myNew', boo1)
  const boo2 = myNew(BooWithReturn, 'alice')
  console.log('myNew', boo2)
}

{
  Object.prototype.myAssgin = function (target, ...sources) {
    if (target === null || target === undefined) {
      throw new TypeError('Cannot convert undefined or null to object')
    }
    target = Object(target)
    for (let source of sources) {
      if (source === null || source === undefined) {
        continue
      }
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
      for (const symbol of Object.getOwnPropertySymbols(source)) {
        target[symbol] = source[symbol]
      }
    }
    return target
  }
}

{
  function myInstanceof(instance, obj) {
    // 基本数据类型返回 false
    if (typeof instance !== 'object' || instance === null) return false

    let proto = Object.getPrototypeOf(instance)
    while (true) {
      if (proto === null) return false
      if (proto === obj.prototype) return true
      proto = Object.getPrototypeOf(proto)
    }
  }
  console.log('myInstanceof', myInstanceof(10, Object), myInstanceof({
    a: 1
  }, Object))
}

{
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true,
      }
    })
    // subClass.prototype.constructor = subClass

    // 继承父类的静态方法
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass
  }

  var B = (function (_super) {
    _inherits(B, _super)

    function B(name, sex) {
      this.sex = sex
      return (_super !== null && _super.call(this, name)) || this // 不继承时返回自身
    }
    // 定义 B 的其他方法
    // B.prototype.speak = function () {}
    return B
  })(A) // A 可以为 null，表示不继承于任何父类

  function A(name) {
    this.name = name
  }
  A.prototype.speak = function () {
    console.log(this.name);
  };
  // 静态方法
  A.walk = function () {
    console.log('walking...')
  }

  const a = new A('Alice')
  const b = new B('Bob', 'male')
  console.log('_inherits', a, b)
  a.speak()
  A.walk()
  b.speak()
  B.walk()
}

{
  console.log("js object 遍历测试")

  const obj = {
    "a": 1,
    [Symbol("b")]: 2
  }
  Object.defineProperty(obj, "c", {
    value: 3,
    enumberable: "false"
  })
  obj.__proto__.d = 4
  obj.__proto__ = Object.create({})
  obj.__proto__.__proto__.e = 5

  console.log("### Object.keys ###")
  Object.keys(obj).forEach(key => console.log("key:", key, "value:", obj[key]))

  console.log("### for in ###")
  for (let key in obj) console.log("key:", key, "value:", obj[key])
  console.log("### for in with Object.hasOwnProperty === Object.keys ###")
  for (let key in obj) obj.hasOwnProperty(key) && console.log("key:", key, "value:", obj[key])

  console.log("### Object.getOwnPropertyNames ###")
  Object.getOwnPropertyNames(obj).forEach(key => console.log("key:", key, "value:", obj[key]))

  console.log("### Object.getOwnPropertySymbols ###")
  Object.getOwnPropertySymbols(obj).forEach(key => console.log("key:", key, "value:", obj[key]))

  console.log("### Reflect.ownKeys ###")
  Reflect.ownKeys(obj).forEach(key => console.log("key:", key, "value:", obj[key]))
}

// 不同执行环境不会共享原型链，因此不能用 Object.getPrototypeOf(obj) === Object.prototype 判断
function isPlainObject(obj) {
  if (typeof obj !== 'object' && obj !== null) return false

  let proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }
  return Object.getPrototypeOf(obj) === proto
}
false && console.log(isPlainObject({
  a: 1
}), isPlainObject(Object.create({
  a: 1
})))

/**
 * 模拟实现 Array.prototype.map
 * callbackfn: (value: any, index: number, array: any[]) => any
 */
Object.prototype.map = function (callbackFn, thisArg) {
  const res = {}
  for (let prop in this) {
    if (this.hasOwnProperty(prop))
      res[prop] = callbackFn.call(thisArg, this[prop], prop, this)
  }
  return res
}
const obj = {
  name: 'alice',
  age: '18'
}
console.log(obj.map(function (val, prop, obj) {
  console.log(this, val, prop, obj)
  return prop + '-->' + val
}, {
  name: 'bob'
}))