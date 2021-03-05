/**
 * indexOf
 */
String.prototype.myIndexOf = function (searchString, position = 0) {
  if (position > this.length) return -1
  if (position < 0) position = 0
  const match = this.substr(position).match(new RegExp(searchString))
  return match ? match.index + position : -1
}
false && console.log('123456789'.myIndexOf('345'))

/**
 * 格式化 100000000 为 100.000.000
 */
function formatNumstrWithDot(str) {
  // return Number(str).toLocaleString().replace(/,/g, '.')
  let ans = ''
  str.split('').reverse().forEach((c, i) => {
    if ((i + 1) % 3) {
      ans = c + ans
    } else {
      ans = '.' + c + ans
    }
  })
  // 处理边界情况
  return ans[0] === '.' ? ans.slice(1) : ans
}
false && console.log(formatNumstrWithDot('100000000'))

/**
 * 模板字符串替换
 */
function render(template, context) {
  // 注意 ?
  return template.replace(/{{(.*?)}}/g, (match, key) => context[key.trim()])
}
false && console.log(render('{{ name }} is a genius, she is {{age}} years old.', {
  name: 'Alice',
  age: 18
}))

/**
 * 大小写翻转
 */
function flip(str) {
  let ans = ''
  for (let c of str) {
    ans += c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
  }
  return ans
}
false && console.log(flip('AbSncdDd'))
