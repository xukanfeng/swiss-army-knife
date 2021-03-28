/**
 * 找出所有父级 id
 */
function findParentId (objs, childId) {
  const ans = []

  /*
  function backtrack(obj, track) {
    if (!obj) return
    if (obj.id === childId) {
      ans.push([...track])
      return
    }
    obj.children && obj.children.forEach(child => {
      track.push(obj.id)
      backtrack(child, track)
      track.pop()
    })
  }
  objs.forEach(obj => backtrack(obj, []))
  */

  function dfs(objs, parentIds) {
    if (!objs) return

    for (let obj of objs) {
      if (obj.id === childId) {
        ans.push([...parentIds])
        continue
      }
      // backtrack 和 dfs 的区别，在于 backtrack 会改变 track 数组内容，dfs 始终传入临时遍历，不需要显式回溯
      dfs(obj.children, parentIds.concat(obj.id))
    }
  }
  dfs(objs, [])

  return ans
}

const objs = [
  {
    id: 1,
    children: [
      {
        id: 2,
        children: [
          {
            id: 3,
          },
          {
            id: 7
          }
        ]
      },
      {
        id: 4
      }
    ]
  },
  {
    id: 5,
    children: [
      {
        id: 6,
        children: [
          {
            id: 7
          }
        ]
      }
    ]
  }
]
console.log(findParentId(objs, 7))