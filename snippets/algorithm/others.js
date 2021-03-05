/**
 * 有一堆牌，第一次取出最上面的牌放到桌上，第二次取出最上面的牌放到这堆牌的底部，以此类推，最后桌上的牌牌底为1，牌顶为16
 * 即：[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
 * 问牌的原始顺序是？
 */
function restoreCards(arr) {
  const origin = []
  let i = 1
  while (arr.length) {
    if (i++ % 2) {
      origin.unshift(arr.pop())
    } else {
      origin.unshift(origin.pop())
    }
  }
  return origin
}
false && console.log(restoreCards([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]))

/**
 * 原地将数组中的 0 移动到最后
 */
function moveZero(arr) {
  let slow = 0
  let fast = 0
  while (fast < arr.length) {
    if (arr[slow] !== 0) {
      slow++
    } else {
      if (arr[fast] !== 0) {
        [arr[slow], arr[fast]] = [arr[fast], arr[slow]]
        slow++
      }
    }
    fast++
  }
}
const arr = [1, 0, 0, 2, 3, 0, 1, 4, 0, 0, 0, 0, 0, 0]
moveZero(arr)
false && console.log(arr)