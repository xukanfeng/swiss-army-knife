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
  Array.prototype.myReduce = function (callback, prev) {
    //遍历this 数组
    for (let i = 0; i < this.length; i++) {
      //判断有没有设置初始值
      if (typeof prev === "undefined") {
        //没有初始值，则调用callback，传入当前值，下一个值，当前 index 为下一个，当前数组
        prev = callback(this[i], this[i + 1], i + 1, this);
      } else {
        //有初始值，则调用callback，传入 prev，当前值，当前 index，当前数组
        prev = callback(prev, this[i], i, this);
      }
    }
    return prev;
  };

  console.log([1, 2, 3, 4].myReduce((prev, curr, index, thisArg) => {
    console.log("index", index)
    return prev + curr
  }, 10))
}