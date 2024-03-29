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
    _self.apply(this, arguments) // 这里的 _self 是 A
  }
}
Function.prototype.after = function (afterFN) {
  const _self = this;
  return function () {
    _self.apply(this, arguments) // 这里的 _self 是 .before 返回的函数，apply 才能执行
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
 * sku 组合数
 * 从每个数组中抽取一个元素，求所有组合
 */
function combination_v1(arrs) {
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

// 回溯法
function combination_v2(arrs) {
  const ans = []

  function backtrack(track, start) {
    if (start === arrs.length) {
      ans.push([...track])
      return
    }
    for (let i = 0; i < arrs[start].length; i++) {
      track.push(arrs[start][i])
      backtrack(track, start + 1)
      track.pop()
    }
  }
  backtrack([], 0)

  return ans
}

console.log(combination_v2([
  ['a', 'b'],
  ['A', 'B'],
  ['0', '1', '2']
]))