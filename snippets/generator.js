{
  function Thunk(fn) {
    return function (...args) {
      return function (callback) {
        return fn.call(this, ...args, callback)
      }
    }
  }

  // 使用 Thunk 函数实现自执行
  function run_v1(fn) {
    const g = fn()

    function next(data) {
      const result = g.next(data)
      if (result.done) return result.value
      result.value(next)
    }

    next()
  }

  // test cases
  function addNAsync(m, n, callback) {
    setTimeout(() => callback(m + n), 1000)
  }
  const addNAsyncThunk = Thunk(addNAsync)

  function addNSync(m, n, callback) {
    callback(m + n)
  }
  const addNSyncThunk = Thunk(addNSync)

  function* gen1(x = 0) {
    const N = 5
    const r1 = yield addNSyncThunk(x, N)
    console.log("r1", r1)
    const r2 = yield addNAsyncThunk(r1, N)
    console.log("r2", r2)
    const r3 = yield addNSyncThunk(r2, N)
    console.log("r3", r3)
    return r3
  }
  run_v1(gen1)

  // 使用 Promise 实现自执行
  function run_v2(fn) {
    return new Promise((resolve, reject) => {
      const g = fn()

      function next(data) {
        let result
        try {
          result = g.next(data)
        } catch(e) {
          reject(e)
        }
        if (result.done) resolve(result.value)
        else Promise.resolve(result.value).then(next).catch(g.throw)
      }

      next()
    })
  }

  // test cases
  function* gen2() {
    const r4 = yield 1
    console.log("r4", r4)
    const r5 = yield new Promise(resolve => setTimeout(() => resolve(2), 2000))
    console.log("r5", r5)
    const r6 = yield 3
    console.log("r6", r6)
    return r6
  }
  run_v2(gen2).then(res => console.log(res))
}

{
  function wrapper(generatorFunction) {
    return function (...args) {
      let generatorObject = generatorFunction(...args);
      generatorObject.next();
      return generatorObject;
    };
  }

  const wrapped = wrapper(function* () {
    const r1 = yield
    console.log(`First input: ${r1}`)
    return 'DONE'
  });
}

{
  function* fibonacci() {
    let [prev, curr] = [0, 1]
    yield prev
    yield curr

    while (true) {
      [prev, curr] = [curr, prev + curr]
      yield curr
    }
  }
  console.log('fibonacci')
  for (let n of fibonacci()) {
    if (n > 5) break
    console.log(n)
  }
}

{
  function* flat(arr) {
    for (let item of arr) {
      if (Array.isArray(item)) {
        yield* flat(item)
      } else {
        yield item
      }
    }
  }
  console.log('flat')
  for (let i of flat([1, [2, 3],
      [4, [5, 6]]
    ])) {
    console.log(i)
  }
}