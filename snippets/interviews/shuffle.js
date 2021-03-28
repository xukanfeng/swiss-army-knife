/**
 * 洗牌算法
 */
function shuffle(arr) {
  for (let i = arr.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
  }
  return arr;
}
false && console.log(shuffle([5, 3, 5, 6, 7, 3, 1, 4, 6, 1]))