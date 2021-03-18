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
    const result = []
    for (let i = 0; i < this.length; i++) {
      if (!this.hasOwnProperty(i)) {
        continue;
      }
      result.push(fn.call(thisArg, this[i], i, this))
    }
    return result
  }

  false && console.log([1, 2, 3, 4].myMap(n => n * 2))
}

/**
 * 多数组求交集
 */
function intersectN(arrs) {
  function intersect2(arr1, arr2) {
    const res = []
    const map = {}
    arr1.forEach(item => {
      map[item] = map[item] ? map[item] + 1 : 1
    })
    arr2.forEach(item => {
      if (map[item]) {
        res.push(item)
        map[item]--
      }
    })
    return res
  }
  return arrs.reduce((prev, curr) => intersect2(prev, curr))
}
false && console.log(intersectN([
  [1, 2, 2, 2, 3, 4, 5],
  [1, 2, 2, 3, 5, 7],
  [2, 2, 5, 1, 6]
]))

function shuffle(arr) {
  for (let i = arr.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
  }
  return arr;
}
false && console.log(shuffle([5, 3, 5, 6, 7, 3, 1, 4, 6, 1]))