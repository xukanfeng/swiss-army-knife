/**
 * 数组求交集
 */
function intersectN(arrs) {
  function intersect2(arr1, arr2) {
    const res = []
    const map = {}
    arr1.forEach(item => {
      map[item] = map[item] ? map[item] + 1 : 1
    })
    arr2.forEach(item => {
      if (map[item]) {
        res.push(item)
        map[item]--
      }
    })
    return res
  }
  return arrs.reduce((prev, curr) => intersect2(prev, curr))
}
false && console.log(intersectN([
  [1, 2, 2, 2, 3, 4, 5],
  [1, 2, 2, 3, 5, 7],
  [2, 2, 5, 1, 6]
]))