{
  const arr = [1, [2, [3, [4, 5]]], 6]

  const flatten1 = arr => {
    return arr.reduce((prev, cur) => {
      return prev.concat(Array.isArray(cur) ? flatten1(cur) : cur)
    }, [])
  }
  console.log(flatten1(arr))

  // 不能处理 ['[', ']'] !
  const flatten2 = arr => {
    return JSON.parse(`[${JSON.stringify(arr).replace(/\[|\]/g, '')}]`) // /[\[\]]/g
  }
  console.log(flatten2(arr))

  const flatten3 = arr => {
    return arr.toString().split(',').map(item => +item)
  }
  console.log(flatten3(arr))

  const flatten4 = arr => {
    const res = []
    while (arr.length) {
      let item = arr.shift()
      if (Array.isArray(item)) {
        arr.unshift(...item)
      } else {
        res.push(item)
      }
    }
    return res
  }
  console.log(flatten4(arr))
}

{
  const arr = [1, 1, '1', 17, true, true, false, false, 'true', 'a', {}, {}]
  // console.log(Array.from(new Set(arr)))
  const unique1 = (arr, res = []) => {
    arr.forEach((item, index) => arr.indexOf(item) === index && res.push(item))
    return res
  }
  console.log(unique1(arr))

  const unique2 = (arr, res = []) => {
    arr.forEach(item => !res.includes(item) && res.push(item))
    return res
  }
  console.log(unique2(arr))

  const unique3 = (arr, res = []) => {
    return arr.filter((item, index) => {
      return arr.indexOf(item) === index
    })
  }
  console.log(unique3(arr))
}

{
  // Array.from
  // Array.prototype.slice.call()
  // Array.prototype.concat.apply([], )
  // ...
}

{
  // reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: readonly T[]) => T): T
  Array.prototype.myReduce = function (fn, initialValue) {
    let arr = [].slice.call(this);
    let startIndex = 0;
    // 通过判断入参长度，可以避免过滤initialValue传入的非法值（0,undifind,...）
    if (arguments.length === 2) {
      arr.unshift(initialValue);
      startIndex = -1
    }
    let result = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (!arr.hasOwnProperty(i)) {
        continue;
      }
      // 将第一次的出参作为第二次的入参，有初始值时，真实索引从 0 开始；无初始值时，真实索引从 1 开始
      result = fn.call(null, result, arr[i], startIndex + i, this);
    }
    return result;
  }

  const cb = (prev, curr, index, thisArg) => {
    console.log(prev, curr, index)
    return prev + curr
  }
  console.log('reduce')
  console.log('case1')
  console.log([1, 2, 3, 4].myReduce(cb))
  console.log('case2')
  console.log([1, 2, 3, 4].reduce(cb))
  console.log('case3')
  console.log([1, 2, 3, 4].myReduce(cb, 10))
  console.log('case4')
  console.log([1, 2, 3, 4].reduce(cb, 10))
}

{
  // map(callbackfn: (value: number, index: number, array: number[]) => any, thisArg?: any): any[]
  Array.prototype.myMap = function (fn, thisArg) {
    const result = []
    for (let i = 0; i < this.length; i++) {
      if (!this.hasOwnProperty(i)) {
        continue;
      }
      result.push(fn.call(thisArg, this[i], i, this))
    }
    return result
  }

  console.log([1, 2, 3, 4].myMap(n => n * 2))
}