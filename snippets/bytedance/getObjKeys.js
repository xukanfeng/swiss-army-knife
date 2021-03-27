/**
 * 从最外层到最内层，从上到下，层序遍历获取对象的 key
 */
// 标准连续层序遍历问题
function getKeys (obj) {
  const ans = []
  let queue = [obj]
  while (queue.length) {
    const o = queue.shift()
    const keys = Object.keys(o)
    ans.push(...keys)
    keys.forEach(key => {
      typeof o[key] === 'object' && queue.push(o[key])
    })
  }
  return ans
}
/**
 * 从最内层到最外层，从上到下，层序遍历获取对象的 key
 */
// 连续层序遍历
function getKeys_v1 (obj) {
  const ans = []
  let queue = [obj]
  while (queue.length) {
    const o = queue.shift()
    const keys = Object.keys(o)
    // console.log(keys)
    // 第一层的 keys 从左到右，满足输出结果
    ans.unshift(...keys)
    // 连续层序遍历时正常遍历顺序为从上到下，从左到右，不能以层作为分组来操作
    // 按题意，除第一层外，每层需要改为从右到左遍历，才能在连续遍历下满足输出结果
    keys.reverse().forEach(key => {
      typeof o[key] === 'object' && queue.push(o[key])
    })
  }
  return ans
}
// 分层层序遍历
function getKeys_v2 (obj) {
  const ans = []
  let queue = [obj]
  while (queue.length) {
    const keys = []
    // 按从上到下的顺序获取 key
    queue.forEach(obj => keys.push(...Object.keys(obj)))
    // console.log('keys in current level', keys)
    // 把一组 key 加入 ans
    ans.unshift(...keys)

    const objs = []
    // 按层序遍历框架遍历队列中保存的同一层的节点
    while (queue.length) {
      const o = queue.shift()
      const keys = Object.keys(o)
      keys.forEach(key => {
        // 把同一层的每个节点的每个子节点按顺序加入队列
        typeof o[key] === 'object' && objs.push(o[key])
      })
    }
    // console.log('objs in next level', objs)
    queue = objs
  }
  return ans
}
const obj = {
  a: {
    b: {
      c: {
        f: 'aa'
      }
    },
    d: {
      e: {
        g: 'bb'
      },
      h: {
        i: 'cc'
      }
    },
    j: {
      k: 'dd'
    }
  },
  l: {
    m: {
      n: 'ee'
    },
    o: 'ff',
    p: 'gg',
    q: {
      r: 'hh',
      s: {
        t: 'ii'
      }
    }
  } 
}
console.log(getKeys(obj))
// ['a', 'l', 'b', 'd', 'j', 'm', 'o', 'p', 'q', 'c', 'e', 'h', 'k', 'n', 'r', 's', 'f', 'g', 'i', 't']
console.log(getKeys_v1(obj))
console.log(getKeys_v2(obj))
// ['f', 'g', 'i', 't', 'c', 'e', 'h', 'k', 'n', 'r', 's', 'b', 'd', 'j', 'm', 'o', 'p', 'q', 'a', 'l']
