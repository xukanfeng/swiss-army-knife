/**
 * 实现 a
 */
let a = {
  value: 1,
  valueOf: () => a.value++
}
if (a == 1 && a == 2 && a == 3) {
  false && console.log('1')
}

/**
 * 实现 (5).add(3).minus(2) === 6
 */
Number.prototype.add = function(n) {
  return this + n
}
Number.prototype.minus = function(n) {
  return this - n
}
false && console.log((5).add(3).minus(2))

