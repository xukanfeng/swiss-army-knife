{
  /**
   * 2. 实现 getValue 函数来获取path对应的值
   */
  var object = {
    'a': [{
      'b': {
        'c': 3
      }
    }]
  }; // path: 'a[0].b.c'
  var array = [{
    "a": {
      b: [1]
    }
  }]; // path: '[0].a.b[0]'

  function getValue(target, valuePath, defaultValue) {
    const keys = valuePath.split(/\[|\]|\./).filter(key => key !== '')

    let obj = target
    for (let key of keys) {
      obj = obj[key]
      if (!obj) return defaultValue
    }
    return obj
  }

  console.log(getValue(object, 'a[0].b.c', 0)); // 输出3
  console.log(getValue(array, '[0].a.b[0]', 12)); // 输出 1
  console.log(getValue(array, '[0].a.b[0].c', 12)); // 输出 12
}