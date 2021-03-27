/**
 * 'aa [bb[c[dd]e ]] fff]gg'
 * 转换为
 * {
    value: 'aa',
    children: {
      value: 'bb',
      children: {
        value: 'c',
        children: [Object]
      }
    }
  }
*/
function normalize(str) {
  // const strs = str.split(/[\[\]]/g).filter(Boolean)
  // console.log(strs) // error: ['aa ', 'bb', 'c', 'dd', 'e ', ' fff', 'gg']
  const strs = str.match(/\w+/g)
  const obj = {}
  let curr = obj
  while (strs.length > 0) {
    curr.value = strs.shift()
    if (strs.length > 0) {
      curr.children = {}
      curr = curr.children
    } else {
      break
    }
  }
  return obj
}
false && console.log(JSON.stringify(normalize('aa [bb[c[dd]e ]] fff]gg')))

/**
 * [{id: 1}, {id: 2, pid: 1}, {id: 3, pid: 1}, {id: 4, pid: 2}, {id: 5}, {id: 6, pid: 5}]
 * 转换为
 * [{"id":1,"children":[{"id":2,"pid":1,"children":[{"id":4,"pid":2}]},{"id":3,"pid":1}]},{"id":5,"children":[{"id":6,"pid":5}]}]
 */
function transform(arr) {
  const ans = []
  const map = {} // 用 map 重新保存 arr 数据，便于查找元素
  arr.forEach(item => {
    map[item.id] = item
  })
  Object.values(map).forEach(item => {
    if (!item.pid) {
      ans.push(item)
    } else {
      map[item.pid].children = map[item.pid].children || []
      map[item.pid].children.push(item)
    }
  })
  return ans
}
false && console.log(JSON.stringify(transform([{
  id: 1
}, {
  id: 2,
  pid: 1
}, {
  id: 3,
  pid: 1
}, {
  id: 4,
  pid: 2
}, {
  id: 5
}, {
  id: 6,
  pid: 5
}])))

/**
 * 对象拍平和展开
 */
const entry = {
  a: {
    b: {
      c: {
        d: '1'
      }
    },
    d: {
      e: '2'
    },
    e: {
      f: '3'
    }
  },
  b: {
    c: '2'
  }
}

function flatObj(entry) {
  const output = {}
  const dfs = (obj, path = '') => {
    Object.keys(obj).forEach(key => {
      const _path = path + key
      if (typeof obj[key] === 'object') {
        dfs(obj[key], _path + '.')
      } else {
        output[_path] = obj[key]
      }
    })
  }
  dfs(entry)
  return output
}
false && console.log(flatObj(entry))

function spreadObj(entry) {
  const output = {}
  const dfs = (obj, path, value) => {
    const dotIndex = path.indexOf('.')
    if (dotIndex === -1) {
      obj[path] = value
    } else {
      const key = path.slice(0, dotIndex)
      obj[key] = obj[key] || {}
      dfs(obj[key], path.slice(dotIndex + 1), value)
    }
  }
  Object.keys(entry).forEach(path => {
    dfs(output, path, entry[path])
  })
  return output
}
false && console.log(spreadObj(flatObj(entry)))

function simpleVerify(entry, output) {
  if (typeof entry === 'object') {
    for (let key of Object.keys(entry)) {
      if (!simpleVerify(entry[key], output[key])) return false
    }
  } else {
    return entry === output
  }
  return true
}
false && console.log(simpleVerify(entry, spreadObj(flatObj(entry))))

/**
 * 查找 'afhjebfbbbaaadhhuuuaa' 中连续出现次数最多的字符和次数
 */
function getLongestChars(str) {
  let ans = {}
  let maxLen = 0
  // 注意 \w 的括号，如不加括号，会按单个字符分组，加括号后，按连续相同字符分组
  const arr = str.match(/(\w)\1*/g)
  arr.forEach(str => {
    if (str.length > maxLen) {
      maxLen = str.length
      ans = {}
      ans[str] = maxLen
    } else if (str.length === maxLen) {
      ans[str] = maxLen
    }
  })
  return ans
}
false && console.log(getLongestChars('afhjebfbbbaaadhhuuuaa'))

/**
 * 整数转 N 进制
 */
const multi1 = (num, N = 7) => ''.padEnd(num).repeat(N).length
const multi2 = (num, N) => [].concat(...([...new Array(num)]).map(_ => [...new Array(N)])).length
const multi3 = (num, N) => ([...new Array(num)]).map(_ => [...new Array(N)]).flat().length
const multi4 = (num, N) => parseInt((num).toString(N) + '0', N)

/**
 * 函数钩子
 */
let A = function () {
  console.log("调用了函数A")
}
Function.prototype.before = function (beforeFN) {
  const _self = this;
  return function () {
    beforeFN.apply(_self, arguments)
    // before 和 after 中的 _self.apply(this, arguments) 都不可缺少，为什么？为什么不会重复调用 A()？
    _self.apply(this, arguments)
  }
}
Function.prototype.after = function (afterFN) {
  const _self = this;
  return function () {
    _self.apply(this, arguments)
    afterFN.apply(_self, arguments)
  }
}
A = A.before(function () {
  console.log("前置钩子")
}).after(function () {
  console.log("后置钩子")
})
false && A()

const _A = A
A = function () {
  console.log('前置钩子')
  _A()
  console.log("后置钩子")
}
false && A()

/**
 * 实现add(one(two(one()))
 */
function add() {
  return [...arguments[0]].reduce((a, b) => a + b)
}

function one() {
  if (arguments.length === 0) return [1]
  else return [...arguments[0], 1]
}

function two() {
  if (arguments.length === 0) return [2]
  else return [...arguments[0], 2]
}
false && console.log(add(one(two(one()))))

/**
 * 判断是否是质数
 */
function isPrime(n) {
  const m = Math.sqrt(n)
  for (let i = 2; i <= m; i++) {
    if (n % i === 0) return false
  }
  return true
}
false && console.log(isPrime(11))

/**
 * 从每个数组中抽取一个元素，求所有组合
 */
function combination(arrs) {
  // 初始化
  let ans = arrs.shift()
  arrs.forEach(arr => {
    let tmp = []
    arr.forEach(item => {
      // 复制当前结果
      const copy = [...ans]
      // 在当前结果的每个字符串后添加新字符
      tmp = tmp.concat(copy.map(str => str += item))
    })
    // 更新结果
    ans = tmp
  })
  return ans
}
console.log(combination([['a', 'b'], ['A', 'B'], ['0', '1', '2']]))