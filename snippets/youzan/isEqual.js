{
  /**
   * 1. 实现一个函数，判断两个变量值是否相等
   * 
   * 注意
   * - 数据类型不限于示例，尽可能考虑边界
   * - function 引用相等即可
   */
  const foo1 = {
    a: 1,
    b: '1',
    c: NaN,
    d: [{
      a: 1,
      b: 2
    }],
    f: {
      a: 1
    },
    g: null
  }
  foo1.h = foo1

  const foo2 = {
    a: 1,
    b: '1',
    c: NaN,
    d: [{
      a: 1,
      b: 2
    }],
    f: {
      a: 1
    },
    g: null
  }
  foo2.h = foo2

  function isEqual(target1, target2) {
    function getType(target) {
      return Object.prototype.toString.call(target)
    }

    function helper(target1, target2, memo = new WeakSet()) {
      const keys = Object.keys(target1)

      for (let key of keys) {
        const value1 = target1[key]
        const value2 = target2[key]

        if (value1 && !value2) return false

        if (getType(value1) === '[object Number]') {
          if (isNaN(value1)) {
            if (!isNaN(value1)) return false
          } else {
            if (value1 !== value2) return false
          }
        } else if (getType(value1) === '[object Boolean]' ||
          getType(value1) === '[object String]' ||
          getType(value1) === '[object Function]' ||
          value1 === null ||
          value1 === undefined) {
          if (value1 !== value2) return false
        } else if (getType(value1) === '[object Object]') {
          if (memo.has(value1)) continue
          else(memo.add(value1))

          let result = helper(value1, value2, memo)
          if (!result) return false
        } else if (getType(value1) === '[object Array]') {
          for (let i = 0; i < value1.length; i++) {
            let result = helper(value1[i], value2[i], memo)
            if (!result) return false
          }
        }
      }
      return true
    }
    return helper(target1, target2)
  }
  console.log(isEqual(foo1, foo2));
}