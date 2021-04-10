{
  let add = (function () {
    const _add = () => {}
    var paramStack = [];

    const proxy = new Proxy(_add, {
      get(target, fnName) {
        if (fnName === 'get')
          return paramStack.reduce((a, b) => a + b);
        return proxy;
      },

      apply(target, thisBinding, args) {
        paramStack.push(Number(args));
        return proxy;
      }
    });
    return proxy
  })()

  console.log(add(1).add(2).add(3).get); //6
}

{
  const target = new Date()
  const proxy = new Proxy(target, {
    get(target, prop) {
      if (prop === 'getDate') {
        // Proxy上不存在 getDate，需要进行绑定
        return target.getDate.bind(target)
      }
      return Reflect.get(target, prop)
    }
  })
  console.log(proxy.getDate()) // TypeError: this is not a Date object.
}

{
  /*
   *使用 Proxy 实现观察者模式
   */
  const queuedObservers = new Set()

  const observe = fn => queuedObservers.add(fn)

  const observable = obj => new Proxy(obj, {
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      queuedObservers.forEach(observer => observer())
      return result;
    }
  })

  const person = observable({
    name: '张三',
    age: 20
  })

  function print() {
    console.log(`${person.name}, ${person.age}`)
  }
  observe(print)
  person.name = '李四' // 李四, 20
}

function autoBind(target) {
  const cache = new WeakMap()
  return new Proxy(target, {
    get(target, prop) {
      const value = Reflect.get(target, prop)
      if (typeof value !== 'function')
        return value
      else {
        if (!cache.has(value)) cache.set(value, value.bind(target))
        return cache.get(value)
      }
    }
  })
}

function wrap(arr) {
  return new Proxy(arr, {
    get(target, key) {
      if (key === Symbol.iterator) {
        return Reflect.get(target, Symbol.iterator)
      }
      return +key < 0 ? Reflect.get(target, target.length + +key) : Reflect.get(target, key)
    },
    set(target, key, value) {
      if (+key < 0) {
        if (target.length + +key < 0) throw new Error()
        Reflect.set(target, target.length + +key, value)
        return true
      }
      Reflect.set(target, key, value)
      return true
    }
  })
}