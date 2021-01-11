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
    const fn = Symbol('fn')
    context[fn] = this
    const res = context[fn](...args)
    delete context[fn]
    return res
  }
  student.myCall(person, 20)

  // function.bind(thisArg, arg1, arg2, ...)
  Function.prototype.myBind = function (context = window, ...args) {
    const self = this
    // new会改变this指向：如果bind绑定后的函数被new了，那么this指向会发生改变，指向当前函数的实例
    const fn = function () {
      self.apply(this instanceof self /* new.target */ ? this : context, [...args, ...arguments])
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
  Object.myCreate = function (obj) {
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

  function BooWithReturn() {
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
  function _extends(child, parent) {
    child.prototype = Object.create(parent.prototype)
    child.prototype.constructor = child
  }

  function B(name) {
    this.name = name
    this.age = 18
  }
  const A = (function (_super) {
    _extends(A, _super)

    function A(name, sex) {
      this.sex = sex
      return (_super !== null && _super.call(this, name)) || this
    }
    return A
  })(B)
  console.log('_extends', new A('Alice', 'female'), new B('Bob'))
}

{
  function _extends(Sub, Super) {
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
  }

  function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
  }
  SuperType.prototype.sayName = function () {
    console.log(this.name);
  };

  function SubType(name, age) {
    SuperType.call(this, name);

    this.name = "sub: " + this.name
    this.age = age
  }

  _extends(SubType, SuperType)
  SubType.prototype.sayAge = function () {
    console.log(this.age)
  }

  // test
  const sub = new SubType("alice", "18")
  sub.colors.push("yellow")
  console.log(sub)
  sub.sayName()
  sub.sayAge()
  console.log(new SuperType("bob"))
}

{
  console.log("js object 遍历测试")

  const obj = {
    "a": 1,
    [Symbol("b")]: 2
  }
  Object.defineProperty(obj, "c", {
    value: 3,
    numberable: "false"
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