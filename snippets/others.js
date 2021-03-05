/**
 * 'aa [bb[c[dd]e ]] fff]gg'
 * 转换为
 * {
    value: 'aa',
    children: {
      value: 'bb',
      children: {
        value: 'c',
        children: [Object]
      }
    }
  }
*/
function normalize(str) {
  // const strs = str.split(/[\[\]]/g).filter(Boolean)
  // console.log(strs) // error: ['aa ', 'bb', 'c', 'dd', 'e ', ' fff', 'gg']
  const strs = str.match(/\w+/g)
  const obj = {}
  let curr = obj
  while (strs.length > 0) {
    curr.value = strs.shift()
    if (strs.length > 0) {
      curr.children = {}
      curr = curr.children
    } else {
      break
    }
  }
  return obj
}
false && console.log(JSON.stringify(normalize('aa [bb[c[dd]e ]] fff]gg')))

/**
 * [{id: 1}, {id: 2, pid: 1}, {id: 3, pid: 1}, {id: 4, pid: 2}, {id: 5}, {id: 6, pid: 5}]
 * 转换为
 * [{"id":1,"children":[{"id":2,"pid":1,"children":[{"id":4,"pid":2}]},{"id":3,"pid":1}]},{"id":5,"children":[{"id":6,"pid":5}]}]
 */
function transform(arr) {
  const ans = []
  const map = {} // 用 map 重新保存 arr 数据，便于查找元素
  arr.forEach(item => {
    map[item.id] = item
  })
  Object.values(map).forEach(item => {
    if (!item.pid) {
      ans.push(item)
    } else {
      map[item.pid].children = map[item.pid].children || []
      map[item.pid].children.push(item)
    }
  })
  return ans
}
false && console.log(JSON.stringify(transform([{
  id: 1
}, {
  id: 2,
  pid: 1
}, {
  id: 3,
  pid: 1
}, {
  id: 4,
  pid: 2
}, {
  id: 5
}, {
  id: 6,
  pid: 5
}])))

/**
 * 查找 'afhjebfbbbaaadhhuuuaa' 中连续出现次数最多的字符和次数
 */
function getLongestChars(str) {
  let ans = {}
  let maxLen = 0
  const arr = str.match(/(\w)\1*/g)
  arr.forEach(str => {
    if (str.length > maxLen) {
      maxLen = str.length
      ans = {}
      ans[str] = maxLen
    } else if (str.length === maxLen) {
      ans[str] = maxLen
    }
  })
  return ans
}
false && console.log(getLongestChars('afhjebfbbbaaadhhuuuaa'))
