{
  /**
   * 1. 实现一个函数，判断两个变量值是否相等
   * 
   * 注意
   * - 数据类型不限于示例，尽可能考虑边界
   * - function 引用相等即可
   *
   * 2. 进阶：元素为复杂类型的数组去重
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

  /**
   * 1.如果把基本类型和对应的包装类型视为相同，可以用隐式转换，例如 +(1) === +(new Number(1))
   * 2.判断构造函数实例时，还需要考虑构造函数是否相同
   */
  function isEqual(target1, target2) {
    function helper(target1, target2, memo = new WeakSet()) {
      // 处理数组和对象
      if (typeof target1 === 'object' && target1 !== null) {
        // 处理对象的循环引用
        if (!Array.isArray(target1)) {
          if (memo.has(target1)) return true
          else memo.add(target1)
        }
        // 区分数组和对象
        if ((!Array.isArray(target1) && Array.isArray(target2)) ||
        (Array.isArray(target1) && !Array.isArray(target2))) return false
        // 长度不一样直接返回 false
        // 数组中可能会存在不可迭代的元素，需要 Refect.ownKeys 保证不遗漏
        if (Reflect.ownKeys(target1).length !== Reflect.ownKeys(target2).length) return false
        // 统一处理数组和对象
        for (let key of Reflect.ownKeys(target1)) {
          if (!helper(target1[key], target2[key], memo)) return false
        }
        return true
      } else {
        return Object.is(target1, target2)
      }
    }
    return helper(target1, target2)
  }

  // test cases
  class Boo {
    boo = 1
  }

  const obj = {
    a: 1,
    b: '1',
    c: [1, 2, '3'],
    boo: new Boo()
  }

  const circularObj = {
    ...obj,
    d: {}
  }
  circularObj.d.e = circularObj.d

  const target1 = [
    null,
    undefined,
    false,
    true,
    Boolean(false),
    1,
    +0,
    -0,
    Infinity,
    NaN,
    Number(1),
    '1',
    [1, 2, 3],
    [1, 2, 3],
    [1, 2, 3],
    obj,
    obj,
    circularObj,
    [1, 2, 3, obj, circularObj],
    Symbol(),
    () => {},
    new Date()
  ]

  const target2 = [
    undefined,
    1,
    true,
    false,
    Boolean(true),
    2,
    -0,
    +0,
    -Infinity,
    NaN,
    Number(2),
    '2',
    [2, 3],
    [1, 2, 4],
    [1, 2, 3, 4],
    {
      ...obj,
      foo: 'foo'
    },
    {
      ...obj,
      a: 2
    },
    circularObj,
    [1, 2, 3, obj, circularObj],
    Symbol(),
    () => {},
    new Date()
  ]

  target1.forEach(item => {
    !isEqual(item, item) && console.log(item, item)
  })
  for (let i = 0; i < target1.length; i++) {
    console.log(isEqual(target1[i], target2[i]), target1[i], target2[i])
  }
}