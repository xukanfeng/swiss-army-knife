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
