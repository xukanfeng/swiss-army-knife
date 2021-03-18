{
  /*
   *
   * 1.状态机
   * 2.then 可以链式调用，需要返回 Promise
   * 3.then 可以被同一个 Promise 多次调用，需要用队列维护回调
   * 4.值穿透 如果 then 的 成功回调不是方法，忽略它；如果失败回调不是方法，抛出异常 
   * 5.如果状态已经改变，直接执行 then 的回调
   * 6.兼容同步任务，使用 setTimeout 包装 Promise 的 resolve/reject 回调
   *
   */

  //Promise/A+规定的三种状态
  const PENDING = 'pending'
  const FULFILLED = 'fulfilled'
  const REJECTED = 'rejected'

  class MyPromise {
    // 构造方法接收一个回调
    constructor(executor) {
      this._status = PENDING // Promise状态
      this._value = undefined // 储存then回调return的值
      this._resolveQueue = [] // 成功队列, resolve时触发
      this._rejectQueue = [] // 失败队列, reject时触发

      // 由于resolve/reject是在executor内部被调用, 因此需要使用箭头函数固定this指向, 否则找不到this._resolveQueue
      let _resolve = (val) => {
        // 把resolve执行回调的操作封装成一个函数,放进setTimeout里,以兼容executor是同步代码的情况
        const run = () => {
          if (this._status !== PENDING) return // 对应规范中的"状态只能由pending到fulfilled或rejected"
          this._status = FULFILLED // 变更状态
          this._value = val // 储存当前value

          // 这里之所以使用一个队列来储存回调,是为了实现规范要求的 "then 方法可以被同一个 promise 调用多次"
          // 如果使用一个变量而非队列来储存回调,那么即使多次p1.then()也只会执行一次回调
          while (this._resolveQueue.length) {
            const callback = this._resolveQueue.shift()
            callback(val)
          }
        }
        setTimeout(run)
      }
      // 实现同resolve
      let _reject = (val) => {
        const run = () => {
          if (this._status !== PENDING) return // 对应规范中的"状态只能由pending到fulfilled或rejected"
          this._status = REJECTED // 变更状态
          this._value = val // 储存当前value
          while (this._rejectQueue.length) {
            const callback = this._rejectQueue.shift()
            callback(val)
          }
        }
        setTimeout(run)
      }
      // new Promise()时立即执行executor,并传入resolve和reject
      executor(_resolve, _reject)
    }

    // then方法,接收一个成功的回调和一个失败的回调
    then(resolveFn, rejectFn) {
      // 根据规范，如果then的参数不是function，则我们需要忽略它, 让链式调用继续往下执行
      typeof resolveFn !== 'function' ? resolveFn = value => value : null
      typeof rejectFn !== 'function' ? rejectFn = reason => {
        throw new Error(reason instanceof Error ? reason.message : reason);
      } : null

      // return一个新的promise
      return new MyPromise((resolve, reject) => {
        // 把resolveFn重新包装一下,再push进resolve执行队列,这是为了能够获取回调的返回值进行分类讨论
        const fulfilledFn = value => {
          try {
            // 执行第一个(当前的)Promise的成功回调,并获取返回值
            let x = resolveFn(value)
            // 分类讨论返回值,如果是Promise,那么等待Promise状态变更,并把 (resolve, reject) 透传下去来处理结果,否则直接resolve
            x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
          } catch (error) {
            reject(error)
          }
        }

        // reject同理
        const rejectedFn = error => {
          try {
            let x = rejectFn(error)
            x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
          } catch (error) {
            reject(error)
          }
        }

        switch (this._status) {
          // 当状态为pending时,把then回调push进resolve/reject执行队列,等待执行
          case PENDING:
            this._resolveQueue.push(fulfilledFn)
            this._rejectQueue.push(rejectedFn)
            break;
            // 当状态已经变为resolve/reject时,直接执行then回调
          case FULFILLED:
            // this._value是上一个then回调return的值
            fulfilledFn(this._value)
            break;
          case REJECTED:
            rejectedFn(this._value)
            break;
        }
      })
    }

    static resolve(value) {
      if (value instanceof MyPromise) return value
      return new MyPromise(resolve => resolve(value))
    }

    static reject(reason) {
      return new MyPromise((resolve, reject) => reject(reason))
    }

    catch(rejectFn) {
      return this.then(undefined, rejectFn)
    }

    finally(callback) {
      return this.then(
        // MyPromise.resolve执行回调,并在then中return结果传递给后面的Promise
        value => MyPromise.resolve(callback()).then(() => value),
        reason => MyPromise.resolve(callback()).then(() => {
          throw reason
        }) // reject同理
      )
    }

    static all(promiseArr) {
      let count = 0
      let result = []
      return new MyPromise((resolve, reject) => {
        promiseArr.forEach((p, i) => {
          //Promise.resolve(p)用于处理传入值不为Promise的情况
          MyPromise.resolve(p).then(
            res => {
              count++
              result[i] = res
              //所有then执行后, resolve结果
              if (count === promiseArr.length) {
                resolve(result)
              }
            },
            err => {
              //有一个Promise被reject时，MyPromise的状态变为reject
              reject(err)
            }
          )
        })
      })
    }

    static race(promiseArr) {
      return new MyPromise((resolve, reject) => {
        //同时执行Promise,如果有一个Promise的状态发生改变,就变更新MyPromise的状态
        for (let p of promiseArr) {
          //Promise.resolve(p)用于处理传入值不为Promise的情况
          MyPromise.resolve(p).then(
            res => {
              resolve(res)
            },
            err => {
              reject(err)
            }
          )
        }
      })
    }

  }

  // test case
  const p1 = new MyPromise((resolve) => {
    resolve(1) //同步executor测试
  })

  false && p1
    .then(res => {
      console.log(res)
      return 2 //链式调用测试
    })
    .then() //值穿透测试
    .then(res => {
      console.log(res)
      return new MyPromise((resolve, reject) => {
        resolve(3) //返回Promise测试
      })
    })
    .then(res => {
      console.log(res)
      throw new Error('reject测试') //reject测试
    })
    .catch(err => { // catch测试
      console.log(err)
    })
    .finally(res => { // finally测试
      console.log(res)
      // throw new Error('4')
      return new MyPromise((resolve, reject) => {
        reject(4)
      })
    })
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })

  false && new MyPromise(resolve => {
    setTimeout(() => resolve(5), 500)
  }).then(res => {
    console.log(res)
    p1.then(res => console.log(6)) // 状态已改变测试 && 多次调用测试
  })

  // 输出
  // 1
  // 2
  // 3
  // Error: reject测试
  // undefined
  // Error: 4
  // 5
  // 6
}

{
  async function asyncPool_v1(tasks, poolLimit) {
    const result = [];
    const executing = [];
    for (let task of tasks) {
      const promise = new Promise(resolve => {
        Promise.resolve(task()).then(res => {
          resolve(res)
          // 在这个有 Promise.race 的场景下，finally 执行时机不确定，为什么？
          executing.splice(executing.indexOf(promise), 1)
        }).catch(err => {
          // 如果不捕获异常，最后调用 Promise.all 时还是会抛出异常。应该在出现异常后将异常 resolve 为 result
          resolve(err)
          executing.splice(executing.indexOf(promise), 1)
        })
      })
      // promise resolve 后，结果保存在 result中
      result.push(promise)
      // 保存正在执行的 promise
      executing.push(promise)
      if (executing.length >= poolLimit) {
        await Promise.race(executing)
      }
    }
    return Promise.all(result);
  }

  function asyncPool_v2(tasks, poolLimit) {
    return new Promise(resolve => {
      const result = []
      let count = 0
      while (count < poolLimit) {
        next()
      }
      // 和 v1 相比，相当于手动实现了 async/await
      function next() {
        // 初始化当前任务的 id
        let current = count++
        const task = tasks[current]
        Promise.resolve(task()).then(res => {
          result[current] = res
        }).catch(err => {
          result[current] = err
        }).finally(() => {
          if (count <= tasks.length - 1) {
            next()
          }
          if (current === tasks.length - 1) {
            resolve(result)
          }
        })
      }
    })
  }

  const timeout = i => new Promise((resolve, reject) => setTimeout(() => {
    console.log(i);
    if (i === 50) reject(i)
    resolve(i)
  }, i));
  (async () => {
    const results = await asyncPool_v2([
      () => timeout(10),
      () => timeout(50),
      () => timeout(30),
      () => timeout(20)
    ], 2);
    console.log('asyncPool', results)
  })();
}

{
  const timer = (x, delay) => () => new Promise(resolve => setTimeout(() => resolve(x, console.log(x)), delay))

  function mergePromise(array) {
    const res = []
    /*
    let p = Promise.resolve()
    array.forEach(item => {
        p = p.then(() => item()).then(r => {res.push(r); return res;})
    })
    */

    let p = array.reduce((prev, cur) => prev.then(() => cur()).then(r => {
      res.push(r);
      return res;
      // 异常处理方案一：把异常作为 result 返回，不打断流程
    }).catch(e => {
      res.push(e);
      return res;
    }), Promise.resolve())

    return p

    // 异常处理方案三：用 Promise 再封装一层，做更多的错误处理
    return new Promise((resolve, reject) => p.then(resolve).catch(e => {
      // 直接抛出错误，等同方案二
      reject(e)
      // 或者返回当前的所有结果
      res.push(e)
      reject(res)
    }))
  }
  false && mergePromise([timer(3, 300), timer(2, 200), timer(1, 100)])
    .then(res => console.log("#", res))
    // 异常处理方案二：出现异常后打断流程，直接抛出错误
    .catch(err => console.log("$", err))
}

{
  const promises = [
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.reject(0),
    Promise.resolve(3),
    4
  ]

  Promise.myAllSettled = function (promises) {
    const result = []
    let settled = 0
    return new Promise(resolve => {
      if (promises.length === 0) resolve([])
      promises.forEach((promise, index) => {
        Promise.resolve(promise).then(res => {
          result[index] = {
            status: "fulfilled",
            value: res
          }
        }).catch(err => {
          result[index] = {
            status: "rejected",
            reason: err
          }
        }).finally(() => {
          if (++settled === promises.length) resolve(result)
        })
      })
    })
  }

  false && Promise.myAllSettled(promises)
}

{
  class Scheduler {
    limit = 2
    excuting = []
    waiting = []

    add(promiseCreator) {
      return this.run(promiseCreator)
    }

    async run(promiseCreator) {
      this.waiting.push(promiseCreator)

      while (this.excuting.length >= this.limit) {
        await Promise.race(this.excuting)
      }
      const p = this.waiting.shift()()
      p.then(() => this.excuting.splice(this.excuting.indexOf(p), 1))
      this.excuting.push(p)
      return p
    }
  }

  const timeout = (time) => new Promise(resolve => {
    setTimeout(resolve, time)
  })

  const scheduler = new Scheduler()
  const addTask = (time, order) => {
    scheduler.add(() => timeout(time))
      .then(() => console.log(order))
  }

  false && (() => {
    addTask(1000, '1')
    addTask(500, '2')
    addTask(300, '3')
    addTask(400, '4')
    // output: 2 3 1 4
  })()
}

function promiseWithAbort(promise) {
  let _abort = null
  /*
  const abort = new Promise((resolve, reject) => {
    // _abort 内存在 reject 的引用，因此可以在外部调用到 reject
    _abort = () => reject('abort')
  })
  const p = Promise.race([promise, abort])
  */
  const p = new Promise((resolve, reject) => {
    _abort = () => reject('abort')
    promise.then(resolve, reject)
  })
  /*
  let controller = new AbortController()
  let signal = controller.signal
  const p = new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject('abort'))
    // 只是为了保持和其他方案一样返回 _abort 才这么写
    _abort = controller.abort.bind(controller)
    promise.then(resolve, reject)
  })
  */

  p.abort = _abort
  return p
}
const p = promiseWithAbort(new Promise(resolve => setTimeout(() => resolve(1), 3000)))
false && p.then(res => console.log(res)).catch(e => console.log(e))
false && p.abort()