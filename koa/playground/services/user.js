const Cookies = require('cookies')

function parseUser(obj) {
  if (!obj) {
    return
  }
  let s = ''
  if (typeof obj === 'string') {
    s = obj
  } else if (obj.headers) {
    let cookies = new Cookies(obj, null)
    s = cookies.get('user')
  }
  if (s) {
    try {
      let user = JSON.parse(s)
      return user
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = parseUser