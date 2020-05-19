const Koa = require('koa')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session2')
const store = require('./redis-store')
const controller = require('./controller')

const app = new Koa()

// error handler
onerror(app)

// middlewares
// parse request body
app.use(bodyParser())
app.use(json())
app.use(logger())
app.use(session({
  store: new store(),
}))
app.use(require('koa-static')(__dirname + '/public/dist'))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// add controllers
app.use(controller())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
