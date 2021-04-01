/**
 * 判断数组方式：
 * arr instanceof Array 不同执行环境不共享原型链，不可靠
 * arr.constructor === Array constructor 可能会被重写，不可靠
 */
{
  const arr = [1, [2, [3, [4, 5]]], 6, , , ]

  const flatten1 = arr => {
    return arr.reduce((prev, cur) => {
      return prev.concat(Array.isArray(cur) ? flatten1(cur) : cur)
    }, [])
  }
  false && console.log(flatten1(arr))

  // 通过参数控制 flat 层数
  const flatten1_layer = (arr, num = 1) => {
    return num > 0 ? arr.reduce((prev, cur) => {
      return prev.concat(Array.isArray(cur) ? flatten1_layer(cur, num - 1) : cur)
    }, []) : arr.slice()
  }
  false && console.log(flatten1_layer(arr, Infinity))

  // 不能处理 ['[', ']'] !，不能处理空位，空位被处理成 null
  const flatten2 = arr => {
    return JSON.parse(`[${JSON.stringify(arr).replace(/\[|\]/g, '')}]`) // /[\[\]]/g
  }
  false && console.log(flatten2(arr))

  // 处理的场景有限，不能处理空位，空位被处理成 0
  const flatten3 = arr => {
    return arr.toString().split(',').map(item => +item)
  }
  false && console.log(flatten3(arr))

  // 不能处理空位，空位被处理成 undefined
  const flatten4 = arr => {
    const res = []
    // 避免修改原数组
    const stack = [].concat(arr)
    while (stack.length) {
      let item = stack.shift()
      if (Array.isArray(item)) {
        stack.unshift(...item)
      } else {
        res.push(item)
      }
    }
    return res
  }
  false && console.log(flatten4(arr))

  Array.prototype.flatten5 = function () {
    return this.reduce((prev, cur) => {
      // 注意 cur.flatten5()
      return prev.concat(Array.isArray(cur) ? cur.flatten5() : cur)
    }, [])
  }
  console.log(arr.flatten5(), arr)
}

{
  const arr = [1, 1, '1', 17, true, true, false, false, 'true', 'a', {}, {}]
  // console.log(Array.from(new Set(arr)))
  const unique1 = (arr, res = []) => {
    arr.forEach((item, index) => arr.indexOf(item) === index && res.push(item))
    return res
  }
  false && console.log(unique1(arr))

  const unique2 = (arr, res = []) => {
    arr.forEach(item => !res.includes(item) && res.push(item))
    return res
  }
  false && console.log(unique2(arr))

  const unique3 = (arr, res = []) => {
    return arr.filter((item, index) => {
      return arr.indexOf(item) === index
    })
  }
  false && console.log(unique3(arr))
}

{
  // Array.from
  // Array.prototype.slice.call()
  // Array.prototype.concat.apply([], )
  // ...
}

{
  // reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: readonly T[]) => T): T
  Array.prototype.myReduce = function () {
    const hasInitialValue = args.length > 1
    // 数组为空，且没有初始值时，抛出异常
    if (!hasInitialValue && this.length === 0) {
      throw new Error()
    }

    let result = hasInitialValue ? args[1] : this[0]

    for (let i = hasInitialValue ? 0 : 1;  i < this.length; i++) {
      result = args[0](result, this[i], i, this)
    }

    return result
  }

  const cb = (prev, curr, index, thisArg) => {
    console.log(prev, curr, index)
    return prev + curr
  }
  /*
  console.log('reduce')
  console.log('case1')
  console.log([1, 2, 3, 4].myReduce(cb))
  console.log('case2')
  console.log([1, 2, 3, 4].reduce(cb))
  console.log('case3')
  console.log([1, 2, 3, 4].myReduce(cb, 10))
  console.log('case4')
  console.log([1, 2, 3, 4].reduce(cb, 10))
  */
}

{
  // map(callbackfn: (value: number, index: number, array: number[]) => any, thisArg?: any): any[]
  Array.prototype.myMap = function (fn, thisArg) {
    const length = this.length
    const result = new Array(length)
    for (let i = 0; i < length; i++) {
      if (!this.hasOwnProperty(i)) {
        continue;
      }
      result[i] = fn.call(thisArg, this[i], i, this)
    }
    return result
  }

  false && console.log([1, 2, 3, 4].myMap(n => n * 2))
}

{
  Array.prototype.mySplice = function (start, deleteCount, ...items) {
    if (start < 0) {
      start += this.length
      if (start < 0) {
        start = 0
      }
    }
    let end
    if (deleteCount === undefined) {
      end = this.length
    } else {
      if (deleteCount <= 0) {
        end = start
      } else {
        end = start + deleteCount
        if (end > this.length) {
          end = this.length
        }
      }
    }
    const deletedArray = [...this.slice(start, end)]
    const newArray = [...this.slice(0, start), ...items, ...this.slice(end)]
    newArray.forEach((item, i) => this[i] = item)
    // 更新数组长度
    this.length = newArray.length
    return deletedArray
  }
  console.log('splice test')
  let arr1, arr2
  arr1 = [1, 2, 3, 4, 5, 6, 7]
  arr2 = [1, 2, 3, 4, 5, 6, 7]
  console.log('case1')
  console.log(arr1, arr1.splice(2))
  console.log(arr2, arr2.mySplice(2))
  console.log('case2')
  console.log(arr1, arr1.splice(20))
  console.log(arr2, arr2.mySplice(20))
  console.log('case3')
  console.log(arr1, arr1.splice(-2))
  console.log(arr2, arr2.mySplice(-2))
  console.log('case4')
  console.log(arr1, arr1.splice(-20))
  console.log(arr2, arr2.mySplice(-20))
  arr1 = [1, 2, 3, 4, 5, 6, 7]
  arr2 = [1, 2, 3, 4, 5, 6, 7]
  console.log('case5')
  console.log(arr1, arr1.splice(2, 1))
  console.log(arr2, arr2.mySplice(2, 1))
  console.log('case6')
  console.log(arr1, arr1.splice(-2, 1))
  console.log(arr2, arr2.mySplice(-2, 1))
  console.log('case7')
  console.log(arr1, arr1.splice(-2, -1))
  console.log(arr2, arr2.mySplice(-2, -1))
  console.log('case8')
  console.log(arr1, arr1.splice(2, 20))
  console.log(arr2, arr2.mySplice(2, 20))
  arr1 = [1, 2, 3, 4, 5, 6, 7]
  arr2 = [1, 2, 3, 4, 5, 6, 7]
  console.log('case9')
  console.log(arr1, arr1.splice(2, 1, [1, 2, 3]))
  console.log(arr2, arr2.mySplice(2, 1, [1, 2, 3]))
  console.log('case10')
  console.log(arr1, arr1.splice(-2, 1, [1, 2, 3]))
  console.log(arr2, arr2.mySplice(-2, 1, [1, 2, 3]))
  console.log('case11')
  console.log(arr1, arr1.splice(2, 20, [1, 2, 3]))
  console.log(arr2, arr2.mySplice(2, 20, [1, 2, 3]))
  console.log('case12')
  console.log(arr1, arr1.splice(2, -2, 11, 12))
  console.log(arr2, arr2.mySplice(2, -2, 11, 12))
}