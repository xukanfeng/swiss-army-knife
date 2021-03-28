
/**
 * 转化为树形结构
 * 
 * [{id: 1}, {id: 2, pid: 1}, {id: 3, pid: 1}, {id: 4, pid: 2}, {id: 5}, {id: 6, pid: 5}]
 * 转换为
 * [{"id":1,"children":[{"id":2,"pid":1,"children":[{"id":4,"pid":2}]},{"id":3,"pid":1}]},{"id":5,"children":[{"id":6,"pid":5}]}]
 */
function convert(arr) {
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
false && console.log(JSON.stringify(convert([{
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