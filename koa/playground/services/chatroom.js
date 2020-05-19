const url = require('url')
const parseUser = require('./user')

let messageIndex = 0
function createMessage(type, user, data) {
  messageIndex++;
  return JSON.stringify({
    id: messageIndex,
    type: type,
    user: user,
    data: data,
  })
}

const chatroom = {
  onConnect(req) {
    let location = url.parse(req.url, true)
    if (location.pathname !== '/chatroom') {
      // close ws
      this.close(4000, 'Invalid URL')
    }
    // check user
    let user = parseUser(JSON.stringify(location.query))
    if (!user) {
      this.close(4001, 'Invalid user')
    }
    this.user = user

    // build user list:
    let users = []
    for (let client of this.wss.clients.keys()) { // the structure of clients is Set
      users.push(client.user)
    }
    this.send(createMessage('list', user, users))

    let msg = createMessage('join', user, `${user.name} joined.`)
    this.wss.broadcast(msg)
  },

  onMessage(message) {
    if (message && message.trim()) {
      let msg = createMessage('chat', this.user, message.trim())
      this.wss.broadcast(msg)
    }
  },

  onClose() {
    let user = this.user
    let msg = createMessage('left', user, `${user.name} is left.`)
    this.wss.broadcast(msg)
  },
}

module.exports = chatroom