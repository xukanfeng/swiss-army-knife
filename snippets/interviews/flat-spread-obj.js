
/**
 * 对象拍平和展开
 */
const entry = {
  a: {
    b: {
      c: {
        d: '1'
      }
    },
    d: {
      e: '2'
    },
    e: {
      f: '3'
    }
  },
  b: {
    c: '2'
  }
}
/*
const output = {
  'a.b.c.d': '1',
  'a.d.e': '2',
  'a.e.f': '3', 
  'b.c': '2'
}
*/

function flatObj(entry) {
  const output = {}
  const dfs = (obj, path = '') => {
    Object.keys(obj).forEach(key => {
      const _path = path + key
      if (typeof obj[key] === 'object') {
        dfs(obj[key], _path + '.')
      } else {
        output[_path] = obj[key]
      }
    })
  }
  dfs(entry)
  return output
}
console.log(flatObj(entry))

function spreadObj(entry) {
  const output = {}
  const dfs = (obj, path, value) => {
    const dotIndex = path.indexOf('.')
    if (dotIndex === -1) {
      obj[path] = value
    } else {
      const key = path.slice(0, dotIndex)
      obj[key] = obj[key] || {}
      dfs(obj[key], path.slice(dotIndex + 1), value)
    }
  }
  Object.keys(entry).forEach(path => {
    dfs(output, path, entry[path])
  })
  return output
}
console.log(JSON.stringify(spreadObj(flatObj(entry))))

function simpleVerify(entry, output) {
  if (typeof entry === 'object') {
    for (let key of Object.keys(entry)) {
      if (!simpleVerify(entry[key], output[key])) return false
    }
  } else {
    return entry === output
  }
  return true
}
false && console.log(simpleVerify(entry, spreadObj(flatObj(entry))))
