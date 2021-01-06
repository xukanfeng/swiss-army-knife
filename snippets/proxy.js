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