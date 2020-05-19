const db = require('../mysql-db')

module.exports = db.defineModel('todolist', {
  desc: db.STRING(200),
  done: db.BOOLEAN,
  stared: db.BOOLEAN,
})