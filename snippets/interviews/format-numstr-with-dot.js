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
console.log(formatNumstrWithDot('100000000'))