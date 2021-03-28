/**
 * 洗牌算法
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
console.log(shuffle([5, 3, 5, 6, 7, 3, 1, 4, 6, 1]))