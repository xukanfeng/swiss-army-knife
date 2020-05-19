const model = require('../model')
const Puzzles = model.Puzzles

const getPuzzlesByUser = async (ctx, next) => {
  const result = await Puzzles.find({ userName: ctx.params.name })

  const res = {
    status: 200,
    data: {
      puzzles: result.map(item => {
        const { setup, punchline } = item
        return { setup, punchline }
      }),
    }
  }

  ctx.response.body = JSON.stringify(res)
}

const getPuzzles = async (ctx, next) => {
  /*
  在 koa 中，获取 GET 请求数据源头是 request 对象中的 query 方法或 querystring 方法，query 返回是
  格式化好的参数对象，querystring 返回的是请求字符串，由于 ctx 对 request 的 API 有直接引用的方式，
  所以获取GET请求数据有两个途径。
  1、从上下文中直接获取
  请求对象 ctx.query，返回如 { a:1, b:2 }
  请求字符串 ctx.querystring，返回如 a=1&b=2
  2、从上下文的 request 对象中获取
  请求对象 ctx.request.query，返回如 { a:1, b:2 }
  请求字符串 ctx.request.querystring，返回如 a=1&b=2
  */
  const result = await Puzzles.find({ userName: ctx.query.name })

  const res = {
    status: 200,
    data: {
      puzzles: result.map(item => {
        const { setup, punchline } = item
        return { setup, punchline }
      }),
    }
  }

  ctx.response.body = JSON.stringify(res)
}

const addPuzzle = async (ctx, next) => {
  const {currentUser: { name }, puzzle: { setup, punchline }} = ctx.request.body

  const puzzle = new Puzzles({
    userName: name,
    setup,
    punchline,
  })
  const result = await puzzle.save()

  ctx.response.body = JSON.stringify({
    status: 200,
  })
}

module.exports = {
  'GET /api/puzzles/:name': getPuzzlesByUser,
  'GET /api/puzzles': getPuzzles,
  'POST /api/puzzles': addPuzzle,
}