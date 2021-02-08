const path = require('path')
console.log(process.cwd())
console.log(__dirname)
console.log('join:', path.join('a', '/b', '..', '/c', '.'))
console.log('resolve:', path.resolve('a', '/b'))
console.log('dirname:', path.dirname('/a/b/c/'))
console.log(require.resolve('./isEqual.js', {
  paths: ['youzan']
}))

console.log(require)
//const r = require.context('./')
//console.log(r)