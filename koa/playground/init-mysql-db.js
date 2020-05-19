// create ddl in non-production environment with 'node init-mysql-db.js'

require('babel-core/register')({
  presets: ['stage-3'], // 需要安装 babel-preset-stage-3，也可以在 .babelrc 中配置
})

const model = require('./model.js')

;(async () => {
  await model.sync()

  console.log('init mysql db ok.')
  process.exit(0)
})()
