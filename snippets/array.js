{
  const arr = [1, [2, [3, [4, 5]]], 6]

  const flatten1 = arr => {
    return arr.reduce((prev, cur) => {
      return prev.concat(Array.isArray(cur) ? flatten1(cur) : cur)
    }, [])
  }
  console.log(flatten1(arr))

  const flatten2 = arr => {
    return JSON.parse(`[${JSON.stringify(arr).replace(/(\[|\])/g, '')}]`)
  }
  console.log(flatten2(arr))
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
    // 通过判断入参长度，可以避免过滤initialValue传入的非法值（0,undifind,...）
    if (arguments.length === 2) {
      arr.unshift(initialValue);
    }
    let result = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (!arr.hasOwnProperty(i)) {
        continue;
      }
      // 将第一次的出参作为第二次的入参
      result = fn.call(null, result, arr[i], i, this);
    }
    return result;
  }

  console.log([1, 2, 3, 4].myReduce((prev, curr, index, thisArg) => prev + curr))
  console.log([1, 2, 3, 4].myReduce((prev, curr, index, thisArg) => prev + curr, 10))
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