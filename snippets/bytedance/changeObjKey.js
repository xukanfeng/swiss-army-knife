function changeKey(str) {
  let chars = str.split('').map((c, index) => {
    if (c.toUpperCase() === c) {
      if (index === 0) {
        return c.toLowerCase()
      } else {
        return '_' + c.toLowerCase()
      }
    } else {
      return c
    }
  })
  return chars.join('')
}

function change(obj) {
  const keys = Object.keys(obj)
  for (let key of keys) {
    if (typeof obj[key] === 'object') {
      change(obj[key])
    }
    const changedKey = changeKey(key)
    // 处理全小写的 key
    if (changedKey === key) continue
    else {
      obj[changedKey] = obj[key]
      delete obj[key]
    }
  }
  return obj
}

console.log(change({
  UserName: 'toutiao',
  Group: {
    groupName: 'douyin',
    Company: {
      name: 'bytedance'
    }
  }
}))