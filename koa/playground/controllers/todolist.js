const model = require('../model')

let TodoList = model.TodoList

const getTodoList = async (ctx, next) => {
  const result = await TodoList.findAll()

  const res = {
    status: 200,
    data: {
      todolist: result.map(item => {
        const { id, desc, done, stared } = item.dataValues
        return { id, desc, done, stared }
      }),
    }
  }

  ctx.response.body = JSON.stringify(res)
}

const updateTodoList = async (ctx, next) => {
  const instance = await TodoList.findOne({
    where: {
      id: ctx.params.id
    }
  })

  const { desc, done, stared } = ctx.request.body
  const result = await instance.update({ desc, done, stared })
  // Q1: TodoList.update、TodoList.upsert 不会进 beforeUpdate Hook
  // Q2: TodoList.update、TodoList.upsert 进 beforeValidate Hook 时，isNewRecord 始终为 true
  // Q3: instance.save 会进两次 beforeValidate Hook，最终执行的 SQL 语句不会更新 updateAt 和 version
  // Q4: Model API 和 instance API 的区别是什么

  ctx.response.body = JSON.stringify({
    status: 200,
  })
}

module.exports = {
  'GET /api/todolist': getTodoList,
  'PUT /api/todolist/:id': updateTodoList,
}