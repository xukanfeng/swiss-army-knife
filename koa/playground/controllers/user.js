module.exports = {
  'POST /signin': async (ctx, next) => {
    let user = {
      name: ctx.request.body.userName, // POST请求从 ctx.request.body 获取参数需要用到 koa-bodyparser 中间件
    }
    value = JSON.stringify(user)
    console.log(`Set cookie value: ${value}`)
    ctx.cookies.set('user', value, {
      domain: 'localhost',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // ms
      expires: new Date(new Date().setDate(new Date().getDate() + 1)),
      httpOnly: false,
      overwrite: false,
    })
    ctx.session.user = user

    const res = {
      status: 200,
      user: user,
    }
    ctx.response.body = JSON.stringify(res)
  },

  'POST /logout': async (ctx, next) => {
    ctx.cookies.set('user', '')
  },
}